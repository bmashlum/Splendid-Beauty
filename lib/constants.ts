export interface SectionConfig {
    id: string;
    imageName: string;
    videoName: string;
}

export const ANIMATED_SECTIONS: SectionConfig[] = [
    { id: 'hero', imageName: 'Home.webp', videoName: 'Home' },
    { id: 'about-us', imageName: 'About Us.webp', videoName: 'About Us' },
    { id: 'award-1', imageName: '3.webp', videoName: 'award_1' },
    { id: 'award-2', imageName: '4.webp', videoName: 'award_2' },
    { id: 'perm-makeup', imageName: 'perm_makeup.webp', videoName: 'perm_makeup' },
    { id: 'perm-medical', imageName: 'perm_medical.webp', videoName: 'perm_medical' },
    { id: 'facial', imageName: 'facial.webp', videoName: 'facial' },
    { id: 'eyelash', imageName: 'eyelash.webp', videoName: 'eyelash' },
    { id: 'academy', imageName: 'Academy.webp', videoName: 'Academy' },
    { id: 'book-now', imageName: 'Book Now.webp', videoName: 'Book Now' },
    { id: 'connect', imageName: 'Connect.webp', videoName: 'Connect' },
    { id: 'financing', imageName: 'Financing.webp', videoName: 'Financing' },
    { id: 'hair-studio', imageName: 'Hair Studio.webp', videoName: 'Hair Studio' },
    { id: 'policies', imageName: 'Policies.webp', videoName: 'Policies' },
    { id: 'portfolio', imageName: 'Portfolio.webp', videoName: 'Portfolio' },
    { id: 'services', imageName: 'Services.webp', videoName: 'Services' },
    { id: 'shop', imageName: 'Shop.webp', videoName: 'Shop' },
    { id: 'we-do-that', imageName: 'We Do That.webp', videoName: 'We Do That' },
    { id: 'true-beauty', imageName: '7.webp', videoName: 'true_beauty' }
];

export const getSectionConfig = (id: string): SectionConfig | undefined => {
    return ANIMATED_SECTIONS.find(section => section.id === id);
}; 