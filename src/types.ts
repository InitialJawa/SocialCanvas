export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'kick_live';
export type TikTokTemplate = 'video' | 'reply';
export type InstagramTemplate = 'comment' | 'live';

export interface AdditionalComment {
  id: string;
  avatarUrl: string;
  username: string;
  handle?: string;
  isVerified: boolean;
  commentText: string;
  timestamp?: string;
  likeCount?: string;
  creatorLiked?: boolean;
  isPinned?: boolean;
}

export interface NestedReply {
  id: string;
  avatarUrl: string;
  username: string;
  handle: string;
  isVerified: boolean;
  commentText: string;
  timestamp: string;
  likeCount: string;
  creatorLiked: boolean;
  isPinned?: boolean;
}

export interface CommentState {
  platform: Platform;
  tiktokTemplate: TikTokTemplate;
  instagramTemplate: InstagramTemplate;
  theme: 'light' | 'dark';
  username: string; 
  handle: string; 
  avatarUrl: string;
  isVerified: boolean;
  commentText: string;
  likeCount: string;
  viewCount: string;
  retweetCount: string;
  replyCount: string;
  timestamp: string;
  creatorLiked: boolean;
  isPinned: boolean;
  fontSize: number;
  replyBubbleColor: string;
  additionalComments: AdditionalComment[];
  nestedReplies: NestedReply[];
  hideLiveBackground: boolean;
  fontFamily: 'roboto' | 'san-francisco' | 'inter' | 'space-grotesk' | 'playfair-display' | 'poppins' | 'jetbrains-mono';
  hasDropShadow: boolean;
  padding: number;
  borderRadius: number;
  cardWidth?: number;
  autoWidth?: boolean;
}

export const defaultState: CommentState = {
  platform: 'tiktok',
  tiktokTemplate: 'video',
  instagramTemplate: 'comment',
  theme: 'light',
  username: 'Nisa Fitriani',
  handle: '@nisa_fitri',
  avatarUrl: 'https://avatars.githubusercontent.com/u/116664738?v=4',
  isVerified: true,
  commentText: 'Wah, kontennya bermanfaat banget kak! Makasih banyak yaa 🔥',
  likeCount: '3.4K',
  viewCount: '1.2M',
  retweetCount: '800',
  replyCount: '24',
  timestamp: '2j lalu',
  creatorLiked: false,
  isPinned: false,
  fontSize: 15,
  replyBubbleColor: '',
  additionalComments: [],
  nestedReplies: [],
  hideLiveBackground: false,
  fontFamily: 'san-francisco',
  hasDropShadow: true,
  padding: 16,
  borderRadius: 12,
  cardWidth: 480,
  autoWidth: true,
};

export interface DraftItem {
  id: string;
  name: string;
  platform: Platform;
  state: CommentState;
  createdAt: string;
  isCloudSynced?: boolean;
}

export interface HistoryItem {
  id: string;
  platform: Platform;
  state: CommentState;
  createdAt: string;
}

