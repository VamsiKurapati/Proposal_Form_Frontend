import axios from 'axios';

// Cloud Image Service for handling image uploads and lazy loading
class CloudImageService {
  constructor() {
    // Use environment variables from .env file
    this.baseUrl = 'https://proposal-form-backend.vercel.app/api/image';
    this.maxFileSize = 1024 * 1024; // 1MB
    this.maxImages = 15;
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
      formData.append('image', processedFile);

      // Upload to cloud
      const response = await axios.post(`${this.baseUrl}/upload_image`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      // With axios, response.data contains the parsed JSON
      const result = response.data;

      // Check for success based on your API response format
      const isSuccess = result.message === 'Image uploaded successfully' || response.status === 200 || response.status === 201;

      if (!isSuccess) {
        throw new Error(result.error || result.message || 'Upload failed');
      }

      // Add to local storage
      const imageData = {
        id: result.fileId,
        name: file.name,
        filename: file.name, // Store the actual filename from API
        fileId: result.fileId, // Store fileId for API requests
        type: file.type,
        size: processedFile.size,
        cloudUrl: `${this.baseUrl}/get_image_by_name/${file.name}`,
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
  async downloadImage(fileId) {
    try {
      const response = await axios.get(`${this.baseUrl}/get_image/${fileId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status !== 200) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      return response.data;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  // Get template image (template images)
  async getTemplateImage(imageName) {
    try {
      // For template images, we need to use the ObjectId endpoint
      // Since frontend only has filename, we'll use the filename endpoint
      const response = await axios.get(`${this.baseUrl}/get_template_image_by_name/${imageName}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status !== 200) {
        throw new Error(`Template download failed: ${response.status} ${response.statusText}`);
      }

      return response.data;
    } catch (error) {
      console.error('Template download error:', error);
      throw error;
    }
  }

  // Delete image from cloud (only for uploaded images)
  async deleteImage(fileId) {
    try {
      const response = await axios.delete(`${this.baseUrl}/delete_image/${fileId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // With axios, response.data contains the parsed JSON
      const result = response.data;

      // Always remove from local storage, even if server deletion fails
      this.uploadedImages = this.uploadedImages.filter(img =>
        img.fileId !== fileId && img.name !== fileId && img.filename !== fileId
      );
      this.saveUploadedImages();

      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('cloudImagesUpdated', {
        detail: { action: 'deleted', fileId }
      }));

      // If server deletion was successful, return true
      if (response.status === 200 && result && result.message && result.message.includes('deleted successfully')) {
        return true;
      }

      // If server deletion failed but we removed from local storage, return true
      return true;

    } catch (error) {
      console.error('Delete error:', error);
      // Even if there's an error, remove from local storage
      this.uploadedImages = this.uploadedImages.filter(img =>
        img.fileId !== fileId && img.name !== fileId && img.filename !== fileId
      );
      this.saveUploadedImages();

      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('cloudImagesUpdated', {
        detail: { action: 'deleted', fileId }
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
      // Try to find the image by name to get fileId
      const image = this.uploadedImages.find(img =>
        img.name === imageName || img.filename === imageName
      );
      if (image && image.fileId) {
        return `${this.baseUrl}/get_image/${image.fileId}`;
      }
      // Fallback to name if fileId not found
      return `${this.baseUrl}/get_image_by_name/${imageName}`;
    }
    return src;
  }

  // Get template URL for template image
  getTemplateUrl(src) {
    if (src.startsWith('template://')) {
      const imageName = src.replace('template://', '');
      return `${this.baseUrl}/get_template_image_by_name/${imageName}`;
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

  // Get the actual fileId from cloud URL for export
  getCloudFileId(src) {
    if (src.startsWith('cloud://')) {
      const imageName = src.replace('cloud://', '');
      // Try to find the image by name to get fileId
      const image = this.uploadedImages.find(img =>
        img.name === imageName || img.filename === imageName
      );
      return image ? image.fileId : imageName;
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
                  fileId: filename, // Use filename as fileId for extracted images
                  type: 'image/png', // Default type
                  size: 1024 * 1024, // Default 1MB size for extracted images
                  cloudUrl: `${this.baseUrl}/get_image_by_name/${filename}`,
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
                fileId: templateName, // Use template name as fileId
                type: 'image/png', // Default type
                size: 1024 * 1024, // Default 1MB size for extracted images
                cloudUrl: `${this.baseUrl}/get_template_image_by_name/${templateName}`,
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

  // Helper method to get filename from cloud URL (for backward compatibility)
  getCloudFilename(src) {
    if (src.startsWith('cloud://')) {
      return src.replace('cloud://', '');
    }
    return null;
  }
}

// Create singleton instance
const cloudImageService = new CloudImageService();

export default cloudImageService;