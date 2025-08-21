// Mock authentication service for testing purposes
export const mockAuthService = {
  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    if (email && password) {
      return {
        success: true,
        data: {
          user: {
            id: '1',
            name: 'John Doe',
            email: email
          },
          token: 'mock-jwt-token-' + Date.now()
        }
      };
    } else {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
  },

  register: async (name: string, email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful registration
    if (name && email && password) {
      return {
        success: true,
        message: 'Registration successful'
      };
    } else {
      return {
        success: false,
        message: 'All fields are required'
      };
    }
  },

  generatePDF: async (invoiceData: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock PDF generation - return a data URL for testing
    const canvas = document.createElement('canvas');
    canvas.width = 595;
    canvas.height = 842;
    const ctx = canvas.getContext('2d')!;
    
    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Header
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, 100);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('INVOICE GENERATOR', 50, 50);
    
    ctx.font = '12px Arial';
    ctx.fillText('Sample for project purpose', 50, 75);
    
    // Convert canvas to blob
    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
  }
};
