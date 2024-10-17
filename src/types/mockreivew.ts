// mockReviewGenerator.ts

export interface MockReview {
    pfp: string;
    fullName: string;
    jobTitle: string;
    review: string;
  }
  
  const fullNames = [
    "John Doe", "Jane Smith", "Alex Johnson", "Emily Brown", "Michael Davis",
    "Sarah Wilson", "David Taylor", "Olivia Anderson", "Daniel Thomas", "Sophia Martinez"
  ];
  
  const jobTitles = [
    "Software Engineer", "Product Manager", "UX Designer", "Data Analyst", "Marketing Specialist",
    "Sales Representative", "HR Manager", "Financial Analyst", "Customer Support Specialist", "Operations Manager"
  ];
  
  const reviewContents = [
    "Absolutely love this product! It's been a game-changer for my workflow.",
    "Great experience overall. The team was very responsive and helpful.",
    "Impressed with the quality and attention to detail. Highly recommended!",
    "Good value for money, but there's room for improvement in some areas.",
    "Exceeded my expectations. Will definitely be a repeat customer.",
    "Solid product with great features. Looking forward to future updates.",
    "Fantastic customer service. They went above and beyond to help me.",
    "Intuitive design and easy to use. Perfect for both beginners and pros.",
    "A bit pricey, but the quality justifies the cost. Very satisfied.",
    "Innovative solution that has significantly improved our team's productivity."
  ];
  
  function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  export function generateMockReview(): MockReview {
    return {
      pfp: `/api/placeholder/48/48`, // Using a placeholder image
      fullName: getRandomElement(fullNames),
      jobTitle: getRandomElement(jobTitles),
      review: getRandomElement(reviewContents),
    };
  }