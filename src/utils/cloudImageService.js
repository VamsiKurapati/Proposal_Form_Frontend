// Cloud Image Service for handling image uploads and lazy loading
class CloudImageService {
  constructor() {
    // Use environment variables from .env file
    this.baseUrl = process.env.REACT_APP_API_URL || 'https://127.0.0.1:5000';
    this.maxFileSize = parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 1024 * 1024; // 1MB
    this.maxImages = parseInt(process.env.REACT_APP_MAX_IMAGES) || 15;
    this.uploadedImages = this.loadUploadedImages();

  }

  // Load uploaded images from localStorage
  loadUploadedImages() {
    try {
      const saved = localStorage.getItem('canva-cloud-images');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading cloud images:', error);
      return [];
    }
  }

  // Save uploaded images to localStorage
  saveUploadedImages() {
    try {
      localStorage.setItem('canva-cloud-images', JSON.stringify(this.uploadedImages));
    } catch (error) {
      console.error('Error saving cloud images:', error);
    }
  }

  // Validate file before upload
  validateFile(file) {
    // Check file size (configurable from .env)
    const maxSizeMB = this.maxFileSize / (1024 * 1024);
    if (file.size > this.maxFileSize) {
      throw new Error(`File size must be less than ${maxSizeMB}MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    // Check file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only PNG, JPG, JPEG, and SVG files are allowed.');
    }

    // Check if we've reached the maximum number of images (configurable from .env)
    if (this.uploadedImages.length >= this.maxImages) {
      throw new Error(`Maximum ${this.maxImages} images allowed. Please delete some images first.`);
    }

    return true;
  }

  // Compress image if needed
  async compressImage(file) {
    return new Promise((resolve) => {
      if (file.size <= this.maxFileSize) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Calculate new dimensions to fit within 1MB
          let { width, height } = img;
          const maxDimension = 1200; // Max width/height

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            } else {
              width = (width * maxDimension) / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          }, file.type, 0.8); // 80% quality
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Upload image to cloud
  async uploadImage(file) {
    try {
      // Validate file
      this.validateFile(file);

      // Compress if needed
      const processedFile = await this.compressImage(file);

      // Create form data
      const formData = new FormData();
      formData.append('file', processedFile);

      // Upload to cloud
      const response = await fetch(`${this.baseUrl}/upload_image`, {
        method: 'POST',
        body: formData,
        // Handle potential SSL certificate issues for local development
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        // If response is not JSON, try to get text
        const responseText = await response.text();
        throw new Error(`Upload succeeded but invalid response format: ${responseText}`);
      }

      // Check for success based on your API response format
      const isSuccess = result.message === 'File uploaded successfully' || response.status === 201;

      if (!isSuccess) {
        throw new Error(result.error || result.message || 'Upload failed');
      }

      // Add to local storage
      const imageData = {
        id: Date.now() + Math.random(),
        name: file.name,
        filename: result.filename || file.name, // Store the actual filename from API
        type: file.type,
        size: processedFile.size,
        cloudUrl: `${this.baseUrl}/download_uploaded_image?name=${result.filename || file.name}`,
        uploadedAt: new Date().toISOString()
      };

      this.uploadedImages.unshift(imageData);
      this.saveUploadedImages();

      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('cloudImagesUpdated', {
        detail: { action: 'uploaded', image: imageData }
      }));

      return imageData;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  // Download image from cloud (uploaded images)
  async downloadImage(imageName) {
    try {
      const response = await fetch(`${this.baseUrl}/download_uploaded_image?name=${encodeURIComponent(imageName)}`, {
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Download failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  // Get template image (template images)
  async getTemplateImage(imageName) {
    try {
      const response = await fetch(`${this.baseUrl}/template_image?name=${encodeURIComponent(imageName)}`, {
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Template download failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Template download error:', error);
      throw error;
    }
  }

  // Delete image from cloud (only for uploaded images)
  async deleteImage(imageName) {
    try {
      const response = await fetch(`${this.baseUrl}/delete_uploaded_image?name=${encodeURIComponent(imageName)}`, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'omit'
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('Failed to parse delete response as JSON:', parseError);
        // Response text not needed for this operation
      }

      // Always remove from local storage, even if server deletion fails
      this.uploadedImages = this.uploadedImages.filter(img => img.name !== imageName && img.filename !== imageName);
      this.saveUploadedImages();

      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('cloudImagesUpdated', {
        detail: { action: 'deleted', imageName }
      }));

      // If server deletion was successful, return true
      if (response.ok && result && result.message && result.message.includes('deleted successfully')) {
        return true;
      }

      // If server deletion failed but we removed from local storage, return true
      return true;

    } catch (error) {
      console.error('Delete error:', error);
      // Even if there's an error, remove from local storage
      this.uploadedImages = this.uploadedImages.filter(img => img.name !== imageName && img.filename !== imageName);
      this.saveUploadedImages();

      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('cloudImagesUpdated', {
        detail: { action: 'deleted', imageName }
      }));

      return true;
    }
  }

  // Get all uploaded images
  getUploadedImages() {
    return [...this.uploadedImages];
  }

  // Clear all uploaded images from local storage
  clearUploadedImages() {
    this.uploadedImages = [];
    this.saveUploadedImages();

    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('cloudImagesUpdated', {
      detail: { action: 'cleared' }
    }));
  }

  // Check if image is cloud-based (uploaded images)
  isCloudImage(src) {
    return src && (src.startsWith('cloud://') || src.includes('download_uploaded_image'));
  }

  // Check if image is a template image
  isTemplateImage(src) {
    return src && (src.startsWith('template://') || src.includes('template_image'));
  }

  // Get cloud URL for uploaded image
  getCloudUrl(src) {
    if (src.startsWith('cloud://')) {
      const imageName = src.replace('cloud://', '');
      return `${this.baseUrl}/download_uploaded_image?name=${encodeURIComponent(imageName)}`;
    }
    return src;
  }

  // Get template URL for template image
  getTemplateUrl(src) {
    if (src.startsWith('template://')) {
      const imageName = src.replace('template://', '');
      return `${this.baseUrl}/template_image?name=${encodeURIComponent(imageName)}`;
    }
    return src;
  }

  // Process image element for JSON export
  processImageForExport(element) {
    if (element.type === 'image' && element.properties.src) {
      const src = element.properties.src;

      // If it's a data URL, we need to upload it first
      if (src.startsWith('data:')) {
        // For now, keep data URLs in export (they'll be compressed)
        // In a real implementation, you'd upload them to cloud first
        return element;
      }

      // If it's already a cloud URL or template URL, keep it
      if (this.isCloudImage(src) || this.isTemplateImage(src)) {
        return element;
      }

      // For other URLs, keep as is
      return element;
    }
    return element;
  }

  // Get the actual filename from cloud URL for export
  getCloudFilename(src) {
    if (src.startsWith('cloud://')) {
      return src.replace('cloud://', '');
    }
    return null;
  }

  // Process image element for JSON import
  processImageForImport(element) {
    if (element.type === 'image' && element.properties.src) {
      const src = element.properties.src;

      // If it's a cloud URL or template URL, keep it as is
      if (this.isCloudImage(src) || this.isTemplateImage(src)) {
        return element;
      }

      // For data URLs, keep them (they'll be loaded lazily)
      if (src.startsWith('data:')) {
        return element;
      }

      // For other URLs, keep as is
      return element;
    }
    return element;
  }

  // Extract images from JSON and add to uploads panel
  extractImagesFromJSON(project) {
    const extractedImages = [];
    const uniqueImageLinks = new Set(); // Track unique image links during extraction

    project.pages?.forEach((page, pageIndex) => {
      page.elements?.forEach((element, elementIndex) => {
        if (element.type === 'image' && element.properties?.src) {
          const src = element.properties.src;

          // Skip if this image link is already processed in this extraction
          if (uniqueImageLinks.has(src)) {
            return;
          }

          // Handle uploaded images (cloud://)
          if (this.isCloudImage(src)) {
            const filename = this.getCloudFilename(src);
            if (filename) {
              // Check if already exists in uploads
              const exists = this.uploadedImages.find(img =>
                img.filename === filename || img.name === filename
              );

              if (!exists) {
                uniqueImageLinks.add(src); // Mark as processed
                extractedImages.push({
                  id: Date.now() + Math.random(),
                  name: filename,
                  filename: filename,
                  type: 'image/png', // Default type
                  size: 1024 * 1024, // Default 1MB size for extracted images
                  cloudUrl: `${this.baseUrl}/download_uploaded_image?name=${filename}`,
                  uploadedAt: new Date().toISOString(),
                  isFromJSON: true,
                  isDeletable: true
                });
              }
            }
          }

          // Handle template images (template://)
          else if (this.isTemplateImage(src)) {
            const templateName = src.replace('template://', '');

            // Check if already exists in uploads
            const exists = this.uploadedImages.find(img =>
              img.name === templateName && img.isTemplate
            );

            if (!exists) {
              uniqueImageLinks.add(src); // Mark as processed
              extractedImages.push({
                id: Date.now() + Math.random(),
                name: templateName,
                filename: templateName,
                type: 'image/png', // Default type
                size: 1024 * 1024, // Default 1MB size for extracted images
                cloudUrl: `${this.baseUrl}/template_image?name=${templateName}`,
                uploadedAt: new Date().toISOString(),
                isFromJSON: true,
                isTemplate: true,
                isDeletable: false // Template images cannot be deleted
              });
            }
          }
        }
      });
    });

    // Add extracted images to uploads
    if (extractedImages.length > 0) {
      this.uploadedImages.unshift(...extractedImages);
      this.saveUploadedImages();

      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('cloudImagesUpdated', {
        detail: { action: 'extracted', count: extractedImages.length }
      }));
    }

    return extractedImages;
  }
}

// Create singleton instance
const cloudImageService = new CloudImageService();

export default cloudImageService; 