import React from 'react';
import { ContentType } from '../ExcelLeftPanel';

interface ShowSectionsButtonProps {
  activeContentType: ContentType;
  onContentTypeChange: (contentType: ContentType) => void;
}

export default function ShowSectionsButton({
  activeContentType,
  onContentTypeChange
}: ShowSectionsButtonProps) {
  return (
    <button
      onClick={() => onContentTypeChange(ContentType.SECTIONS)}
      className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
        activeContentType === ContentType.SECTIONS 
          ? 'bg-blue-700 text-white' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      Show Sections
    </button>
  );
} 