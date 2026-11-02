import React, { useState } from 'react';
import { Users, UserPlus, X, Search, Shield, Check } from 'lucide-react';
import { User } from '../../types/chatnova';
import { INITIAL_CONTACTS } from '../../data/mockData';

interface NewChatModalProps {
  onStartDirect: (contact: User) => void;
  onStartGroup: (name: string, members: string[]) => void;
  onClose: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  onStartDirect,
  onStartGroup,
  onClose,
}) => {
  const [mode, setMode] = useState<'contact' | 'group'>('contact');
  const [groupName, setGroupName] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = INITIAL_CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedContactIds.length === 0) return;
    onStartGroup(groupName.trim(), ['usr_me', ...selectedContactIds]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-[#0D0D12] border border-[#1E1E26] rounded-3xl flex flex-col shadow-2xl overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E26] bg-[#070709]/60">
          <h3 className="text-base font-bold text-white">
            {mode === 'contact' ? 'New Encrypted Chat' : 'Create Encrypted Group'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="p-4 border-b border-[#1E1E26] space-y-3">
          <div className="grid grid-cols-2 gap-2 bg-[#14141B] p-1 rounded-xl">
            <button
              onClick={() => setMode('contact')}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mode === 'contact'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Direct Message
            </button>
            <button
              onClick={() => setMode('group')}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mode === 'group'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              New Group
            </button>
          </div>

          {mode === 'group' ? (
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name (e.g. Cryptography Squad)..."
              className="w-full bg-[#111116] border border-[#1E1E26] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
            />
          ) : (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="w-full bg-[#111116] border border-[#1E1E26] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          )}
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredContacts.map((contact) => {
            const isSelected = selectedContactIds.includes(contact.id);

            return (
              <div
                key={contact.id}
                onClick={() => {
                  if (mode === 'contact') {
                    onStartDirect(contact);
                  } else {
                    toggleSelect(contact.id);
                  }
                }}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#14141B] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={contact.avatarUrl}
                    alt={contact.name}
                    className="w-10 h-10 rounded-2xl object-cover border border-[#1E1E26]"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">{contact.name}</span>
                    <span className="text-[11px] text-slate-400">{contact.bio}</span>
                  </div>
                </div>

                {mode === 'group' && (
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-violet-600 border-violet-500 text-white'
                        : 'border-[#2A2A38] group-hover:border-slate-500'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer for Group Mode */}
        {mode === 'group' && (
          <div className="p-4 border-t border-[#1E1E26] bg-[#070709] flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {selectedContactIds.length} members selected
            </span>
            <button
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || selectedContactIds.length === 0}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              Create Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
