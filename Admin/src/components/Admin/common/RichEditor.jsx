import { useEditor, EditorContent } from "@tiptap/react";
import PropTypes from "prop-types";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Heading1,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
} from "lucide-react";

const MenuButton = ({ onClick, icon: Icon, isActive }) => (
  <button
    onClick={onClick}
    type="button"
    className={`p-2 rounded-md hover:bg-gray-100 transition ${isActive ? "bg-gray-200 text-blue-600" : "text-gray-600"
      }`}
  >
    <Icon size={18} />
  </button>
);

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex gap-2 mb-4 border-b pb-2">
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        icon={Bold}
        isActive={editor.isActive("bold")}
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        icon={Italic}
        isActive={editor.isActive("italic")}
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        icon={Heading1}
        isActive={editor.isActive("heading", { level: 1 })}
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        icon={List}
        isActive={editor.isActive("bulletList")}
      />
      <MenuButton
        onClick={() => {
          const url = prompt("Enter URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        icon={LinkIcon}
        isActive={editor.isActive("link")}
      />
      <MenuButton
        onClick={() => {
          const url = prompt("Image URL");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
        icon={ImageIcon}
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        icon={Code}
        isActive={editor.isActive("codeBlock")}
      />
    </div>
  );
};

const RichEditor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [StarterKit, Link, Image],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[200px]",
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="bg-white rounded-md">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="px-3" />
    </div>
  );
};

RichEditor.propTypes = {
  content: PropTypes.string,
  setContent: PropTypes.func.isRequired,
};

MenuButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.elementType.isRequired,
  isActive: PropTypes.bool,
};

MenuBar.propTypes = {
  editor: PropTypes.object,
};

export default RichEditor;
