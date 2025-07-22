import { 
  isValidImageUrl, 
  optimizeAvatarUrl, 
  extractPhotoUrl, 
  getInitials, 
  getAvatarBackgroundColor, 
  getAvatarTextColor 
} from './avatarUtils';

describe('Avatar Utils', () => {
  describe('isValidImageUrl', () => {
    it('should validate valid image URLs', () => {
      expect(isValidImageUrl('https://example.com/image.jpg')).toBe(true);
      expect(isValidImageUrl('https://example.com/image.png')).toBe(true);
      expect(isValidImageUrl('https://lh3.googleusercontent.com/a/default-user')).toBe(true);
      expect(isValidImageUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidImageUrl('')).toBe(false);
      expect(isValidImageUrl('not-a-url')).toBe(false);
      expect(isValidImageUrl('ftp://example.com/image.jpg')).toBe(false);
      expect(isValidImageUrl('https://example.com/document.pdf')).toBe(false);
    });
  });

  describe('optimizeAvatarUrl', () => {
    it('should optimize Google profile images', () => {
      const googleUrl = 'https://lh3.googleusercontent.com/a/ACg8ocIY26fr-P6Wz3d7EUfcBbsiwsstm4j0NnZZDcSD5RWMigRl8SE';
      const optimized = optimizeAvatarUrl(googleUrl);
      expect(optimized).toBe('https://lh3.googleusercontent.com/a/ACg8ocIY26fr-P6Wz3d7EUfcBbsiwsstm4j0NnZZDcSD5RWMigRl8SE=s128-c');
    });

    it('should update existing Google image size parameters', () => {
      const googleUrl = 'https://lh3.googleusercontent.com/a/ACg8ocIY26fr-P6Wz3d7EUfcBbsiwsstm4j0NnZZDcSD5RWMigRl8SE=s96-c';
      const optimized = optimizeAvatarUrl(googleUrl);
      expect(optimized).toBe('https://lh3.googleusercontent.com/a/ACg8ocIY26fr-P6Wz3d7EUfcBbsiwsstm4j0NnZZDcSD5RWMigRl8SE=s128-c');
    });

    it('should ensure HTTPS', () => {
      const httpUrl = 'http://example.com/image.jpg';
      const optimized = optimizeAvatarUrl(httpUrl);
      expect(optimized).toBe('https://example.com/image.jpg');
    });

    it('should return undefined for invalid URLs', () => {
      expect(optimizeAvatarUrl('invalid-url')).toBeUndefined();
      expect(optimizeAvatarUrl('')).toBeUndefined();
    });
  });

  describe('extractPhotoUrl', () => {
    it('should extract from various user object fields', () => {
      const user1 = { photoUrl: 'https://example.com/photo.jpg' };
      expect(extractPhotoUrl(user1)).toBe('https://example.com/photo.jpg');

      const user2 = { picture: 'https://example.com/picture.jpg' };
      expect(extractPhotoUrl(user2)).toBe('https://example.com/picture.jpg');

      const user3 = { avatar: 'https://example.com/avatar.jpg' };
      expect(extractPhotoUrl(user3)).toBe('https://example.com/avatar.jpg');
    });

    it('should prioritize fields in order', () => {
      const user = {
        avatar: 'https://example.com/avatar.jpg',
        photoUrl: 'https://example.com/photo.jpg',
        picture: 'https://example.com/picture.jpg'
      };
      expect(extractPhotoUrl(user)).toBe('https://example.com/photo.jpg');
    });

    it('should return undefined for invalid or missing URLs', () => {
      expect(extractPhotoUrl({})).toBeUndefined();
      expect(extractPhotoUrl({ photoUrl: '' })).toBeUndefined();
      expect(extractPhotoUrl({ photoUrl: 'invalid-url' })).toBeUndefined();
    });
  });

  describe('getInitials', () => {
    it('should generate initials from names', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Jane Smith Johnson')).toBe('JS');
      expect(getInitials('Madonna')).toBe('M');
      expect(getInitials('')).toBe('');
      expect(getInitials(undefined)).toBe('');
    });
  });

  describe('getAvatarBackgroundColor', () => {
    it('should return consistent colors for same names', () => {
      const color1 = getAvatarBackgroundColor('John Doe');
      const color2 = getAvatarBackgroundColor('John Doe');
      expect(color1).toBe(color2);
    });

    it('should return different colors for different names', () => {
      const color1 = getAvatarBackgroundColor('John Doe');
      const color2 = getAvatarBackgroundColor('Jane Smith');
      // Note: This might occasionally fail due to hash collisions, but very unlikely
      expect(color1).not.toBe(color2);
    });

    it('should return default color for empty name', () => {
      expect(getAvatarBackgroundColor('')).toBe('bg-blue-100');
      expect(getAvatarBackgroundColor(undefined)).toBe('bg-blue-100');
    });
  });

  describe('getAvatarTextColor', () => {
    it('should return corresponding text colors', () => {
      expect(getAvatarTextColor('bg-blue-100')).toBe('text-blue-600');
      expect(getAvatarTextColor('bg-green-100')).toBe('text-green-600');
      expect(getAvatarTextColor('bg-unknown-100')).toBe('text-blue-600'); // fallback
    });
  });
});
