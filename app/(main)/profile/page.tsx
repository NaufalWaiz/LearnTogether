    import Image from 'next/image';
import { 
  Mail, 
  Users, 
  Code, 
  Calendar, 
  ChevronRight, 
  Briefcase, 
  CheckSquare, 
  Flame, 
  FolderOpen, 
  ArrowRight,
  Edit2
} from 'lucide-react';

export default function UserProfile() {
  return (
    <div className="min-bg-[#f8f9fa] min-h-screen py-10 px-4 md:px-0">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* --- CARD TOP: HERO & STATS --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Banner Background */}
          <div className="h-32 bg-[#eef2ff] relative overflow-hidden">
            {/* Dekorasi abstrak kanan atas (bisa diganti asset image asli) */}
            <div className="absolute right-0 top-0 w-48 h-full bg-[#c7d2fe] opacity-50 rounded-bl-full transform translate-x-10 -translate-y-5"></div>
            <div className="absolute left-1/4 top-8 text-blue-300 text-xl font-light">▲</div>
            <div className="absolute left-1/3 top-12 w-3 h-3 border border-blue-300 rounded-full"></div>
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-6 gap-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                {/* Avatar with Next Image */}
                <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-md bg-gray-200 overflow-hidden group">
                  <Image 
                    src="/avatar-placeholder.jpg" // Ganti dengan path foto lu di folder public/
                    alt="Raka Pratama"
                    fill
                    className="object-cover"
                  />
                  <button className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow border border-gray-200 hover:bg-gray-50 transition">
                    <Edit2 className="w-3 h-3 text-blue-600" />
                  </button>
                </div>
                
                {/* Name & Tag */}
                <div className="text-center sm:text-left pt-2">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl font-bold text-gray-800">Raka Pratama</h1>
                    <span className="bg-[#e0e7ff] text-[#4f46e5] text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider">
                      STUDENT
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm font-medium mt-0.5">LearningTogether Member</p>
                  <p className="text-gray-400 text-xs mt-1">Bergabung sejak Mei 2024</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-100 my-4" />

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto sm:mx-0 pt-2">
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-800">5</div>
                  <div className="text-xs text-gray-400 font-medium">Proyek</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 justify-center sm:justify-start border-x border-gray-100 px-2">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-800">24</div>
                  <div className="text-xs text-gray-400 font-medium">Tugas Selesai</div>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-800">12</div>
                  <div className="text-xs text-gray-400 font-medium">Hari Aktif</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- CARD MIDDLE: INFORMASI PRIBADI --- */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Informasi Pribadi</h2>
          
          {/* List Items */}
          {[
            { 
              label: "EMAIL", 
              value: "raka@student.demo", 
              icon: <Mail className="w-5 h-5 text-gray-500" />, 
              bgIcon: "bg-gray-50" 
            },
            { 
              label: "TIM", 
              value: "Mobile Squad - LearningTogether ", 
              extraValue: "(Frontend Team)",
              icon: <Users className="w-5 h-5 text-gray-500" />, 
              bgIcon: "bg-gray-50" 
            },
            { 
              label: "PATH BELAJAR", 
              value: "Frontend Dev • HTML, CSS, JavaScript & Modern UI", 
              icon: <Code className="w-5 h-5 text-gray-500" />, 
              bgIcon: "bg-gray-50" 
            },
            { 
              label: "AVAILABILITY", 
              value: "4–6 jam per minggu", 
              icon: <Calendar className="w-5 h-5 text-gray-500" />, 
              bgIcon: "bg-gray-50" 
            },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50/50 transition cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 ${item.bgIcon} rounded-xl`}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 tracking-wider mb-0.5">{item.label}</div>
                  <div className="text-sm font-semibold text-gray-700">
                    {item.value}
                    {item.extraValue && <span className="text-slate-400 font-normal">{item.extraValue}</span>}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>

        {/* --- CARD BOTTOM: PORTFOLIO CALL-TO-ACTION --- */}
        <div className="bg-[#fefce8] border border-yellow-100 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-yellow-100 rounded-2xl text-yellow-600">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Portfolio</h3>
              <p className="text-sm text-gray-500 max-w-md mt-1 leading-relaxed">
                Kumpulkan hasil project, workflow AI, dan progress tugasmu dalam satu tempat.
              </p>
            </div>
          </div>
          
          <button className="w-full sm:w-auto bg-white hover:bg-gray-50 text-blue-600 font-bold text-sm px-6 py-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-center gap-2 transition whitespace-nowrap">
            Lihat Portfolio
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}