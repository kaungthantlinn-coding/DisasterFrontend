import { 
  isValidImageUrl, 
  optimizeAvatarUrl, 
  extractPhotoUrl, 
  getInitials, 
  getAvatarBackgroundColor, 
  getAvatarTextColor 
} from '../avatarUtils';

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
    it('should extract photo URL from Google user object', () => {
      const googleUser = {
        picture: 'https://lh3.googleusercontent.com/a/ACg8ocIY26fr-P6Wz3d7EUfcBbsiwsstm4j0NnZZDcSD5RWMigRl8SE=s96-c'
      };
      const photoUrl = extractPhotoUrl(googleUser);
      expect(photoUrl).toBe('https://lh3.googleusercontent.com/a/ACg8ocIY26fr-P6Wz3d7EUfcBbsiwsstm4j0NnZZDcSD5RWMigRl8SE=s128-c');
    });

    it('should return undefined for user without picture', () => {
      const userWithoutPicture = {};
      expect(extractPhotoUrl(userWithoutPicture)).toBeUndefined();
    });

    it('should return undefined for invalid picture URL', () => {
      const userWithInvalidPicture = { picture: 'invalid-url' };
      expect(extractPhotoUrl(userWithInvalidPicture)).toBeUndefined();
    });
  });

  describe('getInitials', () => {
    it('should generate initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Jane Smith Johnson')).toBe('JS');
      expect(getInitials('Alice')).toBe('A');
    });

    it('should handle edge cases', () => {
      expect(getInitials('')).toBe('');
      expect(getInitials('   ')).toBe('');
      expect(getInitials('a')).toBe('A');
      expect(getInitials('john doe')).toBe('JD');
    });

    it('should handle special characters', () => {
      expect(getInitials('Jean-Pierre Dupont')).toBe('JD');
      expect(getInitials("O'Connor Smith")).toBe('OS');
      expect(getInitials('李 明')).toBe('李明');
    });
  });

  describe('getAvatarBackgroundColor', () => {
    it('should return consistent colors for same input', () => {
      const color1 = getAvatarBackgroundColor('John Doe');
      const color2 = getAvatarBackgroundColor('John Doe');
      expect(color1).toBe(color2);
    });

    it('should return different colors for different inputs', () => {
      const color1 = getAvatarBackgroundColor('John Doe');
      const color2 = getAvatarBackgroundColor('Jane Smith');
      expect(color1).not.toBe(color2);
    });

    it('should return valid CSS color', () => {
      const color = getAvatarBackgroundColor('Test User');
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  describe('getAvatarTextColor', () => {
    it('should return white for dark backgrounds', () => {
      const darkColor = '#000000';
      expect(getAvatarTextColor(darkColor)).toBe('#FFFFFF');
    });

    it('should return black for light backgrounds', () => {
      const lightColor = '#FFFFFF';
      expect(getAvatarTextColor(lightColor)).toBe('#000000');
    });

    it('should handle colors without hash', () => {
      expect(getAvatarTextColor('000000')).toBe('#FFFFFF');
      expect(getAvatarTextColor('FFFFFF')).toBe('#000000');
    });

    it('should return white as default for invalid colors', () => {
      expect(getAvatarTextColor('invalid')).toBe('#FFFFFF');
      expect(getAvatarTextColor('')).toBe('#FFFFFF');
    });
  });
});
