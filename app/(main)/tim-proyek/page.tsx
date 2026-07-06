'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Tetap pakai Image Next.js bawaan
import { Plus, MoreHorizontal, Calendar, X } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  teamName: string;
  progress: number;
  dueDate: string;
  // Array berisi path gambar lokal (misal: '/avatar.png') atau string kosong '' jika ingin putih bersih
  members: string[];
}

const CARD_THEMES = [
  'bg-blue-500 text-white',
  'bg-purple-500 text-white',
  'bg-emerald-500 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Bubadibako',
      teamName: 'Team Alpha',
      progress: 75,
      dueDate: 'Dec 25',
      // Contoh: member 1 & 3 pakai avatar lokal, member 2 kosong (putih)
      members: ['/default-avatar.png', '', '/default-avatar.png'], 
    },
    {
      id: '2',
      name: 'Web Redesign',
      teamName: 'Design Studio',
      progress: 40,
      dueDate: 'Jan 12',
      members: ['', ''], // Semuanya putih kosong
    },
    {
      id: '3',
      name: 'BoBoiBoy Air',
      teamName: 'Animation Crew',
      progress: 90,
      dueDate: 'Feb 18',
      members: ['/default-avatar.png', '', '/default-avatar.png', ''],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newTeamName, setNewTeamName] = useState('');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      teamName: newTeamName || 'General Team',
      progress: 0,
      dueDate: 'Dec 25',
      // Default project baru kasih 3 member (2 isi avatar lokal, 1 kosong)
      members: ['/default-avatar.png', '', '/default-avatar.png'],
    };

    setProjects([...projects, newProject]);
    setNewProjectName('');
    setNewTeamName('');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Projects</h1>
          <p className="text-slate-500 mt-1">
            You have <span className="text-indigo-600 font-semibold">{projects.length} Projects</span>
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl shadow-md hover:bg-indigo-700 transition font-medium"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => {
          const themeClass = CARD_THEMES[index % CARD_THEMES.length];

          return (
            <Link key={project.id} href={`/tim-proyek/${project.id}`}>
              <div className={`p-6 rounded-[2rem] shadow-sm flex flex-col justify-between h-[220px] cursor-pointer hover:scale-[1.02] hover:shadow-md transition duration-200 ${themeClass}`}>
                
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold leading-tight max-w-[80%] break-words">
                      {project.name} <br />
                      <span className="font-medium opacity-80 text-sm block mt-1">{project.teamName}</span>
                    </h3>
                    <button className="opacity-70 hover:opacity-100 p-1" onClick={(e) => e.preventDefault()}>
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>

                <div className="w-full mt-auto mb-4">
                  <div className="flex justify-between text-xs font-medium opacity-90 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-white/25 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full rounded-full transition-all duration-300" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                    
                  {/* Bagian Avatar Member */}
                  <div className="flex -space-x-2.5 overflow-hidden p-2">
                    {project.members.slice(0, 3).map((imgSrc, i) => (
                      <div 
                        key={i} 
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-white/20 relative"
                      >
                        {imgSrc ? (
                          // Menggunakan Image Next.js untuk aset lokal di folder /public
                          <Image
                            className="object-cover"
                            src={imgSrc} 
                            alt="Project member"
                            fill
                            sizes="32px"
                          />
                        ) : (
                          // Kalo string kosong, otomatis jadi bg putih bersih kosong tanpa gambar
                          <div className="h-full w-full bg-white" />
                        )}
                      </div>
                    ))}
                    {project.members.length > 3 && (
                      <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-white/30 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold text-white z-10">
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                    <Calendar size={13} />
                    {project.dueDate}
                  </div>
                </div>

              </div>
            </Link>
          );
        })}
      </div>

      {/* Modal Box */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-xl border border-slate-100 relative mx-4">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Project</h2>

            <form onSubmit={handleAddProject} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Project Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Bubadibako"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Team Name (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. Marketing Team"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-slate-900"
                />
              </div>

              <div className="flex gap-3 mt-6 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-md"
                >
                  Create Project
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}