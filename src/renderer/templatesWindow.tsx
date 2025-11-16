import React, { useState, useEffect } from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

interface TemplatesWindowProps {
  onClose: () => void;
  onSelect: (templateId: string) => void;
}

export const TemplatesWindow: React.FC<TemplatesWindowProps> = ({ onClose, onSelect }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    if ((window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.send('get-templates');
      ipcRenderer.once('templates-data', (event: any, data: Template[]) => {
        setTemplates(data);
      });
    }
  };

  const categories = ['all', 'email', 'document', 'task', 'custom'];
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div
      style={{
        position: 'fixed',
        top: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 700,
        maxWidth: '95vw',
        maxHeight: 'calc(100vh - 140px)',
        background: '#c0c0c0',
        border: '2px solid #fff',
        borderRightColor: '#000',
        borderBottomColor: '#000',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
        fontFamily: 'MS Sans Serif, Arial, sans-serif',
        fontSize: 11,
        zIndex: 5001,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Title Bar */}
      <div
        style={{
          background: 'linear-gradient(to right, #000080, #1084d0)',
          color: 'white',
          padding: '3px 6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span>⚡</span>
          <span>Quick Templates</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#c0c0c0',
            border: '1px solid #fff',
            borderRightColor: '#000',
            borderBottomColor: '#000',
            width: 16,
            height: 16,
            fontSize: 10,
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: 0
          }}
        >
          ×
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #808080', background: '#c0c0c0' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 12px',
              background: selectedCategory === cat ? '#fff' : '#c0c0c0',
              border: '2px solid',
              borderColor: selectedCategory === cat ? '#fff #000 #fff #fff' : '#fff #808080 #808080 #fff',
              borderBottom: selectedCategory === cat ? 'none' : '2px solid #808080',
              cursor: 'pointer',
              fontSize: 10,
              fontFamily: 'inherit',
              textTransform: 'capitalize',
              marginBottom: selectedCategory === cat ? -2 : 0
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          background: '#fff',
          padding: 12
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {filteredTemplates.map(template => (
            <button
              key={template.id}
              onClick={() => {
                onSelect(template.id);
                onClose();
              }}
              style={{
                padding: 12,
                border: '2px solid',
                borderColor: '#fff #808080 #808080 #fff',
                background: '#f0f0f0',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#e0e0e0')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#f0f0f0')}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>{template.icon}</div>
              <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 11 }}>
                {template.name}
              </div>
              <div style={{ fontSize: 10, color: '#666' }}>
                {template.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: 8,
          borderTop: '1px solid #fff',
          display: 'flex',
          justifyContent: 'flex-end',
          background: '#c0c0c0'
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: '6px 12px',
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: '#fff #000 #000 #fff',
            cursor: 'pointer',
            fontSize: 11,
            fontFamily: 'inherit'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
