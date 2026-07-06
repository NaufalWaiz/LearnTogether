export type Lesson = {
  id: string;
  title: string;
  videoId: string; // YouTube Video ID
  duration: string;
  tag: string;
  bgClass: string;
};

export type Course = {
  title: string;
  slug: string;
  description: string;
  lessons: Lesson[];
};

export const curriculum: Record<string, Course> = {
  'ui-ux-design': {
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    description: 'Pelajari dasar-dasar UI/UX Design, wireframing, prototyping, hingga usability testing.',
    lessons: [
      { id: '1', title: 'What is UI/UX Design?', videoId: 'c9Wg6Cb_YlU', duration: '12m', tag: 'UI/UX Basics', bgClass: 'from-orange-400 to-teal-500' },
      { id: '2', title: 'Figma Tutorial for Beginners', videoId: 'e22XfH13dD0', duration: '45m', tag: 'Figma', bgClass: 'from-teal-600 to-emerald-500' },
      { id: '3', title: 'Wireframing in Figma', videoId: 'tOEnGkEw-b0', duration: '20m', tag: 'Wireframing', bgClass: 'from-emerald-600 to-orange-500' },
      { id: '4', title: 'Color Theory for Designers', videoId: '_2LlSqigOUs', duration: '15m', tag: 'Color Theory', bgClass: 'from-pink-700 to-amber-800' }
    ]
  },
  'frontend-dev': {
    title: 'Frontend Development',
    slug: 'frontend-dev',
    description: 'Belajar HTML, CSS, JavaScript, hingga framework modern seperti React.',
    lessons: [
      { id: '1', title: 'HTML Crash Course', videoId: 'UB1O30fR-EE', duration: '1h', tag: 'HTML', bgClass: 'from-blue-400 to-blue-600' },
      { id: '2', title: 'CSS Crash Course', videoId: 'yfoY53QXEnI', duration: '1h 25m', tag: 'CSS', bgClass: 'from-indigo-500 to-purple-600' },
      { id: '3', title: 'JavaScript Crash Course', videoId: 'hdI2bqOjy3c', duration: '1h 40m', tag: 'JavaScript', bgClass: 'from-yellow-400 to-orange-500' },
      { id: '4', title: 'React JS Crash Course', videoId: 'w7ejDZ8SWv8', duration: '1h 48m', tag: 'React', bgClass: 'from-cyan-400 to-blue-500' }
    ]
  },
  'backend-dev': {
    title: 'Backend Development',
    slug: 'backend-dev',
    description: 'Kuasai pembuatan API, database, dan arsitektur server menggunakan Node.js.',
    lessons: [
      { id: '1', title: 'Node.js Crash Course', videoId: 'fBNz5xF-Kx4', duration: '1h 30m', tag: 'Node.js', bgClass: 'from-green-500 to-emerald-700' },
      { id: '2', title: 'Express.js Crash Course', videoId: 'L72fhGm1tfE', duration: '1h 15m', tag: 'Express', bgClass: 'from-gray-700 to-gray-900' },
      { id: '3', title: 'PostgreSQL Crash Course', videoId: 'qw--VYLpxG4', duration: '1h', tag: 'Database', bgClass: 'from-blue-600 to-indigo-800' },
      { id: '4', title: 'REST API Design', videoId: '-MTSMzWHsqc', duration: '45m', tag: 'API', bgClass: 'from-purple-500 to-pink-600' }
    ]
  },
  'data-science': {
    title: 'Data Science',
    slug: 'data-science',
    description: 'Analisis data, Machine Learning, dan visualisasi menggunakan Python.',
    lessons: [
      { id: '1', title: 'Python for Data Science', videoId: 'ednGgoCm7h0', duration: '2h', tag: 'Python', bgClass: 'from-blue-400 to-yellow-500' },
      { id: '2', title: 'Pandas Data Analysis', videoId: 'zyGJV3zEPEA', duration: '1h', tag: 'Pandas', bgClass: 'from-slate-700 to-slate-900' },
      { id: '3', title: 'Machine Learning Basics', videoId: 'Gv9_4yMHFhI', duration: '1h 30m', tag: 'ML Basics', bgClass: 'from-emerald-400 to-teal-600' }
    ]
  },
  'mobile-dev': {
    title: 'Mobile Development',
    slug: 'mobile-dev',
    description: 'Bangun aplikasi Android & iOS dengan Flutter.',
    lessons: [
      { id: '1', title: 'Flutter Crash Course', videoId: 'VPvVD8t02U8', duration: '1h', tag: 'Flutter', bgClass: 'from-cyan-400 to-blue-600' },
      { id: '2', title: 'Dart Programming Tutorial', videoId: '5F-6n_2XDO8', duration: '2h', tag: 'Dart', bgClass: 'from-sky-500 to-indigo-500' },
      { id: '3', title: 'Building a Flutter App', videoId: '1ukSR1GRtMU', duration: '1h 20m', tag: 'App Build', bgClass: 'from-blue-500 to-purple-600' }
    ]
  },
  'cyber-security': {
    title: 'Cyber Security',
    slug: 'cyber-security',
    description: 'Pelajari dasar keamanan jaringan, ethical hacking, dan kriptografi.',
    lessons: [
      { id: '1', title: 'Cyber Security Full Course', videoId: 'U_P23SqJaDc', duration: '2h', tag: 'Security', bgClass: 'from-red-500 to-orange-600' },
      { id: '2', title: 'Ethical Hacking 101', videoId: 'fNzpcB7iRxo', duration: '1h 45m', tag: 'Hacking', bgClass: 'from-gray-800 to-black' },
      { id: '3', title: 'Linux for Hackers', videoId: 'VbEx7B_PTOE', duration: '1h 10m', tag: 'Linux', bgClass: 'from-yellow-500 to-black' }
    ]
  }
};
