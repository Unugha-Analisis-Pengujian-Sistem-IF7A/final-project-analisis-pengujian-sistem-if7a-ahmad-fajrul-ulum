/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../../app/data/blogSlice";
import DOMPurify from "dompurify";
import { FiCopy, FiCheck } from "react-icons/fi";

const BlogDetail = () => {
  const dispatch = useDispatch();
  const { blogs, isLoading } = useSelector((state) => state.blog);
  const { id } = useParams();
  const [copiedIndex, setCopiedIndex] = useState(null);
  const codeRefs = useRef([]);

  useEffect(() => {
    document.body.style.backgroundColor = "#000000";
    document.body.style.color = "#ffffff";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const blogDetail = blogs.find((p) => p._id === id);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        copiedIndex !== null &&
        !codeRefs.current[copiedIndex]?.contains(event.target)
      ) {
        setCopiedIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [copiedIndex]);

  if (isLoading) {
    return (
      <div className="text-center text-white py-20 bg-black min-h-screen font-mono text-2xl">
        <p className="font-semibold">Memuat artikel...</p>
      </div>
    );
  }

  if (!blogDetail) {
    return (
      <div className="text-center text-white py-20 bg-black min-h-screen font-mono text-2xl">
        <p className="text-5xl mb-4">😕</p>
        <p className="font-semibold">Artikel tidak ditemukan.</p>
        <Link to="/blog" className="text-blue-400 underline mt-4 inline-block">
          ← Kembali ke Blog
        </Link>
      </div>
    );
  }

  const renderContentWithCodeBlocks = (content = "") => {
    const lines = content.split("\n");
    const elements = [];
    let isInCodeBlock = false;
    let codeBuffer = [];
    let blockIndex = -1;

    const parseInlineFormatting = (text) => {
      const html = text
        .replace(
          /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">$1</a>'
        )
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
      return DOMPurify.sanitize(html);
    };

    lines.forEach((line, idx) => {
      if (line.trim().startsWith("```")) {
        if (isInCodeBlock) {
          const code = codeBuffer.join("\n");
          blockIndex++;
          elements.push(
            <div
              key={`code-${idx}`}
              className="relative"
              ref={(el) => (codeRefs.current[blockIndex] = el)}
            >
              <button
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  setCopiedIndex(blockIndex);
                  setTimeout(() => {
                    if (copiedIndex === blockIndex) {
                      setCopiedIndex(null);
                    }
                  }, 3000);
                }}
                className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded z-10"
                title="Salin kode"
              >
                {copiedIndex === blockIndex ? (
                  <FiCheck className="text-green-400" size={20} />
                ) : (
                  <FiCopy size={20} />
                )}
              </button>
              <pre className="bg-[#1e1e1e] text-white p-4 rounded-md overflow-x-auto text-lg font-mono">
                <code>{code}</code>
              </pre>
            </div>
          );
          codeBuffer = [];
          isInCodeBlock = false;
        } else {
          isInCodeBlock = true;
        }
      } else if (isInCodeBlock) {
        codeBuffer.push(line);
      } else if (line.trim() !== "") {
        const sanitized = parseInlineFormatting(line);
        elements.push(
          <p
            key={`p-${idx}`}
            className="whitespace-pre-line mb-4"
            dangerouslySetInnerHTML={{ __html: sanitized }}
          />
        );
      }
    });

    return elements;
  };

  const isValidImage = (url) =>
    typeof url === "string" &&
    url.trim() !== "" &&
    /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);

  return (
  <div className="bg-gradient-to-br from-black via-[#1a0000] to-black text-white min-h-screen pt-24 pb-16 px-4 md:px-6 font-mono text-base md:text-lg leading-relaxed">
    <div className="max-w-4xl mx-auto space-y-16">
      {/* Gambar & Judul */}
      <div className="space-y-6">
        {isValidImage(blogDetail.blogImage) && (
          <img
            src={blogDetail.blogImage}
            alt={blogDetail.title}
            className="w-full h-56 md:h-64 object-cover rounded-xl shadow-md"
          />
        )}
        <h1 className="text-2xl md:text-4xl font-bold leading-snug">{blogDetail.title}</h1>
        <p className="text-sm md:text-base text-gray-400">
          {new Date(blogDetail.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Konten Artikel */}
      <div className="prose prose-invert max-w-none text-gray-300 font-mono text-sm md:text-base leading-relaxed">
        {renderContentWithCodeBlocks(blogDetail.content)}
      </div>

      {/* Tombol Kembali */}
      <div className="pt-10">
        <Link
          to="/blog"
          className="text-blue-400 hover:underline font-medium text-base md:text-lg"
        >
          ← Kembali ke Blog
        </Link>
      </div>
    </div>
  </div>
);

};

export default BlogDetail;
