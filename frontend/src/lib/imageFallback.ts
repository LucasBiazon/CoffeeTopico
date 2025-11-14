export function getCoffeeImage(c: {
  image_url?: string;
  type?: string;
  name?: string;
}) {
  if (c.image_url) return c.image_url;

  const name = (c.name || '').toLowerCase();
  if (name.includes('latte')) {
    return 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800';
  }
  if (name.includes('cappuccino')) {
    return 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800';
  }
  if (name.includes('espresso')) {
    return 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800';
  }
  if (c.type === 'bean') {
    return 'https://images.unsplash.com/photo-1502452213786-a5bc0a67e963?w=800';
  }
  if (c.type === 'drink') {
    return 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=800';
  }

  return 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=800';
}
