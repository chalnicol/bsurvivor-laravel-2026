import { cn, getImageUrl } from '@/lib/utils';
import { useEffect, useState } from 'react';

const FileInput = ({
  image,
  onChange,
  disabled,
}: {
  image: File | string | null;
  onChange: (value: File | string | null) => void;
  disabled?: boolean;
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [toUpload, setToUpload] = useState(false);

  useEffect(() => {
    if (image && typeof image === 'string') {
      setPreview(getImageUrl(image));
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      // Create a temporary local URL for the file preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Clean up memory when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const url = e.target.value;
    // setData('logo', url);
    onChange(url);
    setPreview(url);
  };

  const handleImageOptionsClick = (toUpload: boolean) => {
    setToUpload(toUpload);
    // setData('logo', null);
    onChange(null);
    setPreview(null);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex h-30 w-full flex-shrink-0 flex-col overflow-hidden rounded border border-gray-300 sm:aspect-[2/1.5] sm:h-auto sm:w-34">
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="h-2/3 w-full flex-grow object-contain p-2"
              onError={(e) => {
                console.error('Invalid image URL provided');
                setPreview(null); // Clear the broken preview
                // Optional: you could also clear the form data or show a local error
                // setData('logo', null);
              }}
            />
            <button
              type="button"
              className="flex-shrink-0 cursor-pointer bg-gray-600 px-1 py-0.5 text-[10px] font-semibold text-gray-300 uppercase hover:bg-gray-500"
              onClick={() => {
                setPreview(null);
                onChange(null);
              }}
            >
              clear
              {/* <X size={12} /> */}
            </button>
          </>
        ) : (
          <p className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-slate-400">
            No image selected
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col space-y-3">
        <div className="grid grid-cols-2 divide-x divide-gray-400 overflow-hidden rounded border border-gray-300">
          <button
            type="button"
            className={cn(
              'cursor-pointer p-1.5 text-xs hover:bg-gray-800/50 disabled:pointer-events-none disabled:cursor-default',
              toUpload ? '' : 'bg-gray-800 text-amber-100',
            )}
            onClick={() => handleImageOptionsClick(false)}
            disabled={disabled || !toUpload}
          >
            I have a link
          </button>
          <button
            type="button"
            className={cn(
              'cursor-pointer p-1.5 text-xs hover:bg-gray-800/50 disabled:pointer-events-none disabled:cursor-default',
              toUpload ? 'bg-gray-800 text-amber-100' : '',
            )}
            onClick={() => handleImageOptionsClick(true)}
            disabled={disabled || toUpload}
          >
            I'll upload a photo
          </button>
        </div>

        <div className="flex-grow">
          {toUpload ? (
            <input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="contents-center block h-full w-full cursor-pointer content-center rounded border border-gray-300 p-2 text-sm text-slate-400 file:mr-4 file:rounded file:border-0 file:bg-gray-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-300 hover:file:bg-gray-600"
            />
          ) : (
            <textarea
              value={typeof image === 'string' ? image : ''}
              onChange={handleImageUrlChange}
              className="block h-full w-full resize-none rounded border border-gray-300 bg-transparent p-1 px-2 text-sm text-gray-400 outline-none"
              placeholder="input url link here.."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FileInput;
