import React from 'react';
import { CommentState } from './types';

export const maleUsernames = [
  'Budi Santoso', 'Andi Firmansyah', 'Reza Hidayat', 'Arya Wirawan', 'Fajar Sidik', 
  'Hendra Pratama', 'Rizky Fadillah', 'Agus Susanto', 'Aditya Putra', 'Dimas Prasetyo',
  'Kevin Sanjaya', 'Bayu Saputra', 'Rangga Wijaya', 'Suryo Baskoro', 'Aris Munandar',
  'Dedi Setiawan', 'Bagus Pamungkas', 'Bima Sakti', 'Candra Gunawan', 'Dani Ramadhan',
  'Eko Yulianto', 'Ferry Irawan', 'Gatot Sugiarto', 'Hasan Basri', 'Irwan Syahputra',
  'Joko Purwanto', 'Rizal Fahmi', 'Kiki Setiawan', 'Lukman Hakim', 'Muhammad Rizki',
  'Nugroho Adi', 'Oki Saputra', 'Pandu Dewanata', 'Qori Akbar', 'Ricky Ahmad',
  'adit.zip', 'denis.raw', 'dika.exe', 'bima.sys', 'bayu.bat',
  'andi.dev', 'budi.code', 'reza.js', 'dani.ts', 'fajar.py',
  'kang.cilok', 'bocah.kentang', 'anak.warnet', 'kang.parkir', 'bucin.akut',
  'jagoan.neon', 'suhu.coding', 'master.mabar'
];

export const femaleUsernames = [
  'Siti Rahmawati', 'Lestari Indah', 'Ayu Ningsih', 'Nisa Fitriani', 'Rina Marlina',
  'Sari Wulandari', 'Amalia Nisa', 'Ratna Galih', 'Tasya Kirana', 'Salma Fauziah',
  'Nanda Putri', 'Hani Khairunnisa', 'Cinta Permata', 'Dian Pratiwi', 'Rani Mulyani',
  'Ria Astuti', 'Maudy Kusuma', 'Riska Yuliana', 'Intan Permatasari',
  'Tiara Agustin', 'Lidia Natalia', 'Citra Maharani', 'Maya Sari', 'Mira Lestari',
  'Ghea Saraswati', 'Bella Safitri', 'Annisa Fitri', 'Putri Dina', 'Lesti Handayani',
  'Dinda Shafira', 'Syifa Azzahra', 'Natasha Aurelia', 'Febby Rahma', 'Siska Noviana',
  'Desy Ratnawati', 'Eka Putri', 'Fitriani R', 'Gita Maharani', 'Hana Pertiwi',
  'zxuan', 'kyra', 'luna.rx', 'nana.aest', 'kuroko.x', 
  'rara.ly', 'bila.png', 'tara.jpg', 'sari.mp4', 'rani.gif',
  'fika_ootd', 'riri_daily', 'putri_vlogs', 'sinta_cooks', 'nana_draws',
  'pemburu.diskon', 'kaum.rebahan', 'sobat.misqueen', 'warga.62',
  'netizen.budiman', 'pakar.cinta', 'dukun.cinta'
];
const comments = [
  'Wah, kontennya bermanfaat banget kak!',
  'Info loker bang? 🙏',
  'Gila sih ini epic banget! 🔥🔥🔥',
  'Makasih infonya kak...',
  'Ada yang tau judul lagunya?',
  'Bisa dijelasin lebih detail nggak bagian akhirnya?'
];

const maleAvatars = [
  'https://avatars.githubusercontent.com/u/129738392?v=4',
  'https://avatars.githubusercontent.com/u/118709646?v=4',
  'https://avatars.githubusercontent.com/u/40487188?v=4',
  'https://avatars.githubusercontent.com/u/48324618?v=4',
  'https://avatars.githubusercontent.com/u/7764302?v=4',
  'https://avatars.githubusercontent.com/u/88219725?v=4',
  'https://avatars.githubusercontent.com/u/6789991?v=4',
  'https://avatars.githubusercontent.com/u/36522826?v=4',
  'https://avatars.githubusercontent.com/u/55318172?v=4',
  'https://avatars.githubusercontent.com/u/41313785?v=4',
  'https://avatars.githubusercontent.com/u/96912274?v=4',
  'https://avatars.githubusercontent.com/u/16249870?v=4',
  'https://avatars.githubusercontent.com/u/130666567?v=4',
  'https://avatars.githubusercontent.com/u/50790111?v=4',
  'https://avatars.githubusercontent.com/u/65714340?v=4',
  'https://avatars.githubusercontent.com/u/44051546?v=4',
  'https://avatars.githubusercontent.com/u/19812460?v=4',
  'https://avatars.githubusercontent.com/u/103609643?v=4',
  'https://avatars.githubusercontent.com/u/284841814?v=4',
  'https://avatars.githubusercontent.com/u/32432134?v=4',
  'https://avatars.githubusercontent.com/u/19247405?v=4'
];

const femaleAvatars = [
  'https://avatars.githubusercontent.com/u/74167210?v=4',
  'https://avatars.githubusercontent.com/u/22741734?v=4',
  'https://avatars.githubusercontent.com/u/116664738?v=4',
  'https://avatars.githubusercontent.com/u/116238063?v=4',
  'https://avatars.githubusercontent.com/u/44581981?v=4',
  'https://avatars.githubusercontent.com/u/50509930?v=4',
  'https://avatars.githubusercontent.com/u/40421876?v=4',
  'https://avatars.githubusercontent.com/u/44392365?v=4',
  'https://avatars.githubusercontent.com/u/32873856?v=4',
  'https://avatars.githubusercontent.com/u/65379658?v=4',
  'https://avatars.githubusercontent.com/u/53899191?v=4',
  'https://avatars.githubusercontent.com/u/113233993?v=4',
  'https://avatars.githubusercontent.com/u/91299284?v=4',
  'https://avatars.githubusercontent.com/u/45817042?v=4',
  'https://avatars.githubusercontent.com/u/75818386?v=4'
];

export function getRandomAvatarUrl(gender: 'male' | 'female'): string {
  const avatars = gender === 'male' ? maleAvatars : femaleAvatars;
  return avatars[Math.floor(Math.random() * avatars.length)];
}

export function getRandomState(currentState: CommentState): CommentState {
  const isMale = Math.random() > 0.5;
  const usernames = isMale ? maleUsernames : femaleUsernames;
  const name = usernames[Math.floor(Math.random() * usernames.length)];
  const comment = comments[Math.floor(Math.random() * comments.length)];
  
  return {
    ...currentState,
    username: name,
    handle: `@${name.replace(/\s+/g, '').toLowerCase()}${Math.floor(Math.random() * 100)}`,
    avatarUrl: getRandomAvatarUrl(isMale ? 'male' : 'female'),
    isVerified: Math.random() > 0.5,
    commentText: comment,
    likeCount: Math.floor(Math.random() * 1000) + (Math.random() > 0.5 ? 'K' : ''),
    timestamp: `${Math.floor(Math.random() * 24) + 1}j lalu`
  };
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function renderFormattedText(text: string) {
  const parts = text.split(/(\[(?:highlight|blur|cut)\].*?\[\/(?:highlight|blur|cut)\])/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('[highlight]') && part.endsWith('[/highlight]')) {
      const content = part.substring(11, part.length - 12);
      return <mark key={index} className="bg-yellow-300 text-black px-0.5 rounded">{content}</mark>;
    }
    if (part.startsWith('[blur]') && part.endsWith('[/blur]')) {
      const content = part.substring(6, part.length - 7);
      return <span key={index} className="blur-[4px] select-none text-transparent">{content}</span>;
    }
    if (part.startsWith('[cut]') && part.endsWith('[/cut]')) {
      const content = part.substring(5, part.length - 6);
      return <span key={index} className="opacity-0 select-none">-</span>;
    }
    
    // Process mentions and hashtags
    const words = part.split(/([@#][\w_]+)/g);
    return (
      <React.Fragment key={index}>
        {words.map((word, wIdx) => {
          if (word.startsWith('@') || word.startsWith('#')) {
            return <span key={wIdx} className="text-[#0057D9] dark:text-[#3EA6FF] font-semibold">{word}</span>;
          }
          return <React.Fragment key={wIdx}>{word}</React.Fragment>;
        })}
      </React.Fragment>
    );
  });
}
