'use client';

import React, { useState } from 'react';

const DUMMY_USERS = [
  { id: 'u1', name: 'Revani Khoirunnisa', role: 'Project Manager', avatar: '👩', status: 'online' },
  { id: 'u2', name: 'Bima Aditya', role: 'UI/UX Designer', avatar: '👨', status: 'online' },
  { id: 'u3', name: 'Cinda Aulia', role: 'Frontend Developer', avatar: '👩', status: 'away' },
  { id: 'u4', name: 'Joni Saputra', role: 'Backend Developer', avatar: '🧔', status: 'online' },
  { id: 'u5', name: 'Eka Pratama', role: 'QA Engineer', avatar: '👨', status: 'away' },
  { id: 'u6', name: 'Fahri Dzaki', role: 'Content Writer', avatar: '👨', status: 'online' },
];

const PRIORITY_OPTIONS = [
  { value: 'High', color: 'text-red-500 bg-red-50' },
  { value: 'Mid', color: 'text-green-500 bg-green-50' },
  { value: 'Low', color: 'text-gray-500 bg-gray-50' },
];

const TAG_OPTIONS = [
  { value: 'Design', color: 'bg-blue-600' },
  { value: 'Research', color: 'bg-purple-600' },
  { value: 'Dev', color: 'bg-orange-500' },
  { value: 'Planning', color: 'bg-pink-500' },
  { value: 'Content', color: 'bg-teal-500' },
];

const INITIAL_COLUMNS = {
  todo: {
    title: 'TODO',
    bgStyles: 'bg-purple-50/70 border-purple-100',
    textStyles: 'text-purple-700',
    badgeStyles: 'bg-purple-200 text-purple-800',
    tasks: [
      { id: 't1', title: 'High priority mobile app design health', desc: 'High priority work will be done on health', tag: 'Design', tagColor: 'bg-blue-600', progressPercentage: 35, assignedTo: ['u1', 'u2'], priority: 'High', priorityColor: 'text-red-500 bg-red-50' },
      { id: 't2', title: 'Research mobile app', desc: 'can make a small diameter junior low priority', tag: 'Research', tagColor: 'bg-purple-600', progressPercentage: 0, assignedTo: ['u3'], priority: 'Low', priorityColor: 'text-gray-500 bg-gray-50' },
    ]
  },
  in_progress: {
    title: 'IN PROGRESS',
    bgStyles: 'bg-blue-50/70 border-blue-100',
    textStyles: 'text-blue-700',
    badgeStyles: 'bg-blue-200 text-blue-800',
    tasks: [
      { id: 't3', title: 'Implement a low priority software very simple', desc: 'An easy software will be made quickly', tag: 'Dev', tagColor: 'bg-orange-500', progressPercentage: 20, assignedTo: ['u1', 'u4'], priority: 'Low', priorityColor: 'text-gray-500 bg-gray-50' },
      { id: 't4', title: 'A good landing page design will be made', desc: 'A good customer needs a nice design', tag: 'Design', tagColor: 'bg-blue-600', progressPercentage: 15, assignedTo: ['u2'], priority: 'Mid', priorityColor: 'text-green-500 bg-green-50' },
      { id: 't5', title: 'Hospital application', desc: 'Need a quick application', tag: 'Planning', tagColor: 'bg-pink-500', progressPercentage: 70, assignedTo: ['u5'], priority: 'Low', priorityColor: 'text-gray-500 bg-gray-50' },
    ]
  },
  completed: {
    title: 'COMPLETED',
    bgStyles: 'bg-green-50/70 border-green-100',
    textStyles: 'text-green-700',
    badgeStyles: 'bg-green-200 text-green-800',
    tasks: [
      { id: 't6', title: 'Content mobile app', desc: 'not too important', tag: 'Content', tagColor: 'bg-teal-500', progressPercentage: 100, assignedTo: ['u6'], priority: 'Low', priorityColor: 'text-gray-500 bg-gray-50' }
    ]
  }
};

type ColumnKey = keyof typeof INITIAL_COLUMNS;

export default function ProjectDashboardOnly() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [activeColumnKey, setActiveColumnKey] = useState<ColumnKey | null>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('Mid');
  const [newTag, setNewTag] = useState('Design');
  const [newProgress, setNewProgress] = useState(0);
  const [newAssignees, setNewAssignees] = useState<string[]>([]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');

  const totalTasks = Object.values(columns).reduce((acc, col) => acc + col.tasks.length, 0);
  const completedTasks = columns.completed.tasks.length;
  const overallProgressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleDragStart = (e: React.DragEvent, taskId: string, sourceCol: ColumnKey) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ taskId, sourceCol }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetCol: ColumnKey) => {
    e.preventDefault();
    const dataStr = e.dataTransfer.getData('text/plain');
    if (!dataStr) return;

    const { taskId, sourceCol }: { taskId: string; sourceCol: ColumnKey } = JSON.parse(dataStr);
    if (sourceCol === targetCol) return;

    const sourceTasks = [...columns[sourceCol].tasks];
    const targetTasks = [...columns[targetCol].tasks];
    
    const taskIndex = sourceTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const [movedTask] = sourceTasks.splice(taskIndex, 1);
    
    if (targetCol === 'completed') {
      movedTask.progressPercentage = 100;
    }

    setColumns({
      ...columns,
      [sourceCol]: { ...columns[sourceCol], tasks: sourceTasks },
      [targetCol]: { ...columns[targetCol], tasks: [...targetTasks, movedTask] }
    });
  };

  const handleOpenModal = (columnKey: ColumnKey) => {
    setActiveColumnKey(columnKey);
    setIsModalOpen(true);
    setNewAssignees([]);
    setNewPriority('Mid');
    setNewTag('Design');
    setNewProgress(0);
  };

  const handleToggleAssignee = (userId: string) => {
    if (newAssignees.includes(userId)) {
      setNewAssignees(newAssignees.filter(id => id !== userId));
    } else {
      setNewAssignees([...newAssignees, userId]);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !activeColumnKey) return;

    const selectedPriorityObj = PRIORITY_OPTIONS.find(p => p.value === newPriority) || PRIORITY_OPTIONS[1];
    const selectedTagObj = TAG_OPTIONS.find(t => t.value === newTag) || TAG_OPTIONS[0];

    const newTask = {
      id: `t_${Date.now()}`,
      title: newTitle,
      desc: newDesc || 'No description provided.',
      tag: selectedTagObj.value,
      tagColor: selectedTagObj.color,
      progressPercentage: activeColumnKey === 'completed' ? 100 : Number(newProgress),
      assignedTo: newAssignees,
      priority: selectedPriorityObj.value,
      priorityColor: selectedPriorityObj.color
    };

    setColumns({
      ...columns,
      [activeColumnKey]: {
        ...columns[activeColumnKey],
        tasks: [...columns[activeColumnKey].tasks, newTask]
      }
    });

    setNewTitle('');
    setNewDesc('');
    setNewAssignees([]);
    setIsModalOpen(false);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Undangan kolaborasi berhasil dikirim ke: ${inviteEmail} sebagai ${inviteRole}`);
    setInviteEmail('');
    setIsInviteOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 flex flex-col">
      <main className="p-4 md:p-8 flex-1 overflow-y-auto max-w-[1600px] w-full mx-auto">
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 tracking-wider">Health Mobile App</p>
          <div className="flex flex-wrap items-center justify-between gap-4 mt-1">
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mobile App Projects</h1>
              
              <div className="bg-white px-4 py-2 rounded-xl border border-gray-200/80 shadow-sm flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Overall Progress:</span>
                <div className="w-24 md:w-32 bg-gray-100 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${overallProgressPercentage}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-green-600">{overallProgressPercentage}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🤖</span>
            <h2 className="text-base font-bold text-gray-900">AI Summary</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Project Health Mobile App bertujuan untuk membuat aplikasi manajemen kesehatan interaktif. Fokus saat ini adalah menyelesaikan fitur integrasi data dan penyempurnaan UI.
          </p>
          <div className="space-y-2.5 text-xs font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Progres berjalan sesuai rencana ({overallProgressPercentage}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-500">⚠</span>
              <span>Perhatian: 1 task memerlukan review prioritas tinggi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500">ℹ</span>
              <span>Disarankan: Tim UI/UX mulai mendesain aset modul berikutnya lebih awal</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {(Object.keys(columns) as Array<ColumnKey>).map((key) => {
              const column = columns[key];
              return (
                <div 
                  key={key} 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, key)}
                  className={`border rounded-2xl p-4 flex flex-col min-h-[550px] transition-colors ${column.bgStyles}`}
                >
                  <div className="flex justify-between items-center mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold tracking-wider ${column.textStyles}`}>{column.title}</span>
                      <span className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${column.badgeStyles}`}>
                        {column.tasks.length}
                      </span>
                    </div>
                    <span className="text-gray-400 cursor-pointer text-sm">•••</span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {column.tasks.map((task) => {
                      return (
                        <div 
                          key={task.id} 
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id, key)}
                          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group relative"
                        >
                          <div className="flex justify-between items-start">
                            <span className={`${task.tagColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-md`}>
                              {task.tag}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${task.priorityColor}`}>
                              {task.priority}
                            </span>
                          </div>
                          
                          <div>
                            <h4 className="font-bold text-sm text-gray-900 leading-snug">{task.title}</h4>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.desc}</p>
                          </div>
                          <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between text-[10px] font-medium text-gray-500">
                              <span>Task Progress</span>
                              <span className="font-bold text-gray-700">{task.progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                              <div 
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${task.progressPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between mt-1">
                            <span className="text-[10px] text-gray-400 font-medium">ID: {task.id}</span>
                            <div className="flex -space-x-1.5 overflow-hidden">
                              {task.assignedTo.map((userId) => {
                                const user = DUMMY_USERS.find(u => u.id === userId);
                                return (
                                  <div 
                                    key={userId} 
                                    className="w-5 h-5 bg-blue-50 border border-white rounded-full flex items-center justify-center text-[10px]" 
                                    title={user?.name}
                                  >
                                    {user?.avatar || '👤'}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    onClick={() => handleOpenModal(key)}
                    className="mt-4 w-full py-2 border border-dashed border-gray-300 rounded-xl text-xs font-semibold text-blue-600 hover:bg-white hover:border-blue-200 transition-colors bg-white/40"
                  >
                    + Add Card
                  </button>
                </div>
              );
            })}
          </div>

          <div className="space-y-6">
            
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">Anggota Tim ({DUMMY_USERS.length})</h3>
                <button 
                  onClick={() => setIsInviteOpen(true)}
                  className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
                >
                  + Undang
                </button>
              </div>

              <div className="space-y-3.5">
                {DUMMY_USERS.slice(0, 4).map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-lg shadow-sm">
                        {user.avatar}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 leading-tight">{user.name}</h4>
                        <span className="text-[10px] text-gray-400 font-medium">{user.role}</span>
                      </div>
                    </div>
                    <span 
                      className={`w-1.5 h-1.5 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-amber-400'}`}
                    ></span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setIsMembersModalOpen(true)}
                className="w-full mt-4 text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors pt-2 border-t border-gray-100 flex items-center justify-between"
              >
                <span>Lihat semua anggota</span>
                <span>➔</span>
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Detail Project</h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-gray-400 font-medium">📅 Deadline</span>
                  <span className="text-gray-700 font-semibold">20 Agustus 2026</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-gray-400 font-medium">👤 Dibuat oleh</span>
                  <span className="text-gray-700 font-semibold">Revani Khoirunnisa</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-gray-400 font-medium">🕒 Dibuat pada</span>
                  <span className="text-gray-700 font-semibold">5 Juni 2026</span>
                </div>
                
                <div className="pt-2">
                  <span className="text-gray-400 font-medium block mb-2">🏷 Label</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 font-bold text-[10px] rounded-md">Mobile App</span>
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 font-bold text-[10px] rounded-md">Health</span>
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 font-bold text-[10px] rounded-md">High Priority</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Add New Card to <span className="text-blue-600 uppercase">{activeColumnKey?.replace('_', ' ')}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Task Title</label>
                <input 
                  type="text" required placeholder="contoh: Perbaiki bug halaman utama" value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Description</label>
                <textarea 
                  rows={2} placeholder="Jelaskan detail yang harus dikerjakan" value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Flair / Tag Label</label>
                  <select
                    value={newTag} onChange={(e) => setNewTag(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    {TAG_OPTIONS.map(tag => (
                      <option key={tag.value} value={tag.value}>{tag.value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Priority</label>
                  <select
                    value={newPriority} onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    {PRIORITY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.value}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Assign To</label>
                <div className="max-h-28 overflow-y-auto border border-gray-200 rounded-xl p-2 bg-gray-50 space-y-1">
                  {DUMMY_USERS.map((user) => {
                    const isChecked = newAssignees.includes(user.id);
                    return (
                      <label 
                        key={user.id} 
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs ${isChecked ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-100'}`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{user.avatar}</span>
                          <span className="font-semibold text-gray-700">{user.name}</span>
                        </div>
                        <input 
                          type="checkbox" checked={isChecked} onChange={() => handleToggleAssignee(user.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm shadow-sm transition-colors">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isInviteOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>📩</span> Undang Anggota
              </h3>
              <button onClick={() => setIsInviteOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Email Address</label>
                <input 
                  type="email" required placeholder="username@company.com" value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Project Role</label>
                <select
                  value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsInviteOpen(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm shadow-sm transition-colors">Kirim Undangan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isMembersModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>👥</span> Semua Anggota Tim ({DUMMY_USERS.length})
              </h3>
              <button onClick={() => setIsMembersModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {DUMMY_USERS.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-xl shadow-sm relative">
                      {user.avatar}
                      <span 
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${user.status === 'online' ? 'bg-green-500' : 'bg-amber-400'}`}
                      ></span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 leading-tight">{user.name}</h4>
                      <p className="text-xs text-gray-400 font-medium">{user.role}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md capitalize ${user.status === 'online' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                    {user.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
              <button 
                onClick={() => setIsMembersModalOpen(false)} 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}