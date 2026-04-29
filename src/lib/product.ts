import type { AspectRatio } from '@/types/generation';

export const TEXT_TO_IMAGE_MODEL = {
  id: 'gpt-image-2',
  apiModelId: 'gpt-image-2-all',
  openaiApiModelId: 'gpt-image-1.5',
  name: 'GPT Image 2',
  provider: 'OpenAI',
  creditCost: 3,
  costUsd: 0.05,
};

export const ASPECT_RATIOS: {
  value: AspectRatio;
  label: string;
  description: string;
  size: string;
}[] = [
  { value: '1:1', label: 'Square', description: 'Avatars and social posts', size: '1024x1024' },
  { value: '16:9', label: 'Wide', description: 'Banners and thumbnails', size: '1536x1024' },
  { value: '9:16', label: 'Story', description: 'Shorts and vertical posts', size: '1024x1536' },
  { value: '4:3', label: 'Classic', description: 'Blog and product visuals', size: '1536x1024' },
  { value: '3:4', label: 'Portrait', description: 'Posters and portraits', size: '1024x1536' },
];

export const ASPECT_RATIO_DIMENSIONS = Object.fromEntries(
  ASPECT_RATIOS.map((ratio) => {
    const [width, height] = ratio.size.split('x').map(Number);
    return [ratio.value, { width, height }];
  })
) as Record<AspectRatio, { width: number; height: number }>;

export type BillingCycle = 'monthly' | 'yearly';

export const PLAN_BENEFITS = [
  { label: 'Credits', free: '20 credits', lite: '300 / month', pro: '800 / month' },
  { label: 'Images per month', free: '20 images', lite: '300 images', pro: '800 images' },
  { label: 'Videos per month', free: '2 videos', lite: '30 videos', pro: '80 videos' },
  { label: 'Parallel jobs', free: '1', lite: '2', pro: '3' },
  { label: 'Available models', free: 'Basic models', lite: 'All models', pro: 'All models' },
  { label: 'Text to image', free: 'Included', lite: 'Included', pro: 'Included' },
  { label: 'Image to image', free: 'Included', lite: 'Included', pro: 'Included' },
  { label: 'Text to video', free: 'Included', lite: 'Included', pro: 'Included' },
  { label: 'Image to video', free: 'Included', lite: 'Included', pro: 'Included' },
  { label: 'Templates and effects', free: 'Included', lite: 'Included', pro: 'Included' },
  { label: 'Generation speed', free: 'Standard', lite: 'Standard', pro: 'Priority' },
  { label: 'Output quality', free: 'Standard', lite: 'HD', pro: '4K / HD' },
  { label: 'Watermark', free: 'Yes', lite: 'No', pro: 'No' },
  { label: 'History retention', free: '7 days', lite: '30 days', pro: '1 year' },
  { label: 'Support', free: 'Community', lite: 'Email', pro: 'Priority' },
];

export const PRICING_PLANS = [
  {
    key: 'lite',
    plan: 'Lite',
    monthlyPrice: '$15',
    yearlyOriginalPrice: '$15',
    yearlyPrice: '$10',
    yearlyBadge: 'Best value',
    yearlySavings: 'Save $60 every year',
    monthlyBadge: 'Creator starter',
    benefitKey: 'lite',
  },
  {
    key: 'pro',
    plan: 'Pro',
    monthlyPrice: '$29',
    yearlyOriginalPrice: '$29',
    yearlyPrice: '$14.50',
    yearlyBadge: 'Save 50%',
    yearlySavings: 'Save $174 every year',
    monthlyBadge: 'Most powerful',
    benefitKey: 'pro',
  },
];
