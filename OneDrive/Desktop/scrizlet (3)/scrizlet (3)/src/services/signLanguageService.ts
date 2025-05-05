// Sign Language Service - Pure function utilities

// Get first letter of a sign term for display purposes
export function getSignInitial(sign: any): string {
  if (!sign || !sign.term) return 'A';
  return sign.term.charAt(0).toUpperCase();
}

// Groups an array of signs by their first letter
export function groupSignsByLetter(signs: any[]) {
  const groups: { [key: string]: any[] } = {};
  
  // Sort signs alphabetically by term
  const sortedSigns = [...signs].sort((a, b) => 
    a.term.toLowerCase().localeCompare(b.term.toLowerCase())
  );
  
  // Group by first letter
  sortedSigns.forEach(sign => {
    const firstLetter = sign.term.charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(sign);
  });
  
  return groups;
}

// Load recently viewed signs from localStorage
export function getRecentSigns(limit: number = 5): any[] {
  try {
    const storedData = localStorage.getItem('pastSigns');
    if (storedData) {
      const pastSigns = JSON.parse(storedData);
      return pastSigns.slice(0, limit);
    }
  } catch (error) {
    console.error('Error parsing stored past signs:', error);
  }
  return [];
}

// Get the daily featured sign
export function getDailySign(allSigns: any[]): { sign: any, lastUpdated: string | null } {
  if (allSigns.length === 0) {
    return { sign: null, lastUpdated: null };
  }
  
  try {
    const storedData = localStorage.getItem('signOfTheDay');
    
    if (storedData) {
      const { sign, timestamp } = JSON.parse(storedData);
      const lastUpdateDate = new Date(timestamp);
      const currentDate = new Date();
      
      // Check if it's been less than 24 hours since last update
      if (
        currentDate.getDate() === lastUpdateDate.getDate() &&
        currentDate.getMonth() === lastUpdateDate.getMonth() &&
        currentDate.getFullYear() === lastUpdateDate.getFullYear()
      ) {
        return {
          sign,
          lastUpdated: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
    }
    
    // If no valid stored sign is found or it's been 24 hours, get a new one
    const randomIndex = Math.floor(Math.random() * allSigns.length);
    const sign = allSigns[randomIndex];
    
    // Save to localStorage
    const timestamp = new Date().toISOString();
    localStorage.setItem('signOfTheDay', JSON.stringify({ sign, timestamp }));
    
    return {
      sign,
      lastUpdated: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } catch (error) {
    console.error('Error managing sign of the day:', error);
    // Fallback to a random sign
    const randomIndex = Math.floor(Math.random() * allSigns.length);
    return {
      sign: allSigns[randomIndex],
      lastUpdated: null
    };
  }
}
