import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { FaArrowLeft, FaUpload } from "react-icons/fa6";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function BlogEditorForm({ handleBackToList, selectedBlog }) {
  const [blogData, setBlogData] = useState({
    title: "",
    slug: "",
    description: "",
    summary: "",
    isFeatured: false,
    image: "",
    category: "",
    tags: [],
    seo: {
      title: "",
      description: "",
      author: "",
      image: "",
      keywords: [],
    },  
    editorDescription: "",
  });

  useEffect(() => {
    if (selectedBlog) {
      setBlogData(selectedBlog);
    }
  }, [selectedBlog]);

  useEffect(() => {
    const formattedSlug = blogData.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setBlogData((prev) => ({ ...prev, slug: formattedSlug }));
  }, [blogData.title]);

  
  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const timestamp = Date.now();
        const fileExtension = file.name.split(".").pop();
        const uniqueFileName = `${timestamp}.${fileExtension}`;
        const imageRef = ref(storage, `/blogs/${uniqueFileName}`);

        // Check if the image already exists in storage
        try {
          const existingImageURL = await getDownloadURL(imageRef);
          console.log("Image already exists in storage:", existingImageURL);

          if (field === "image") {
            setBlogData((prevData) => ({
              ...prevData,
              image: existingImageURL,
            }));
          } else if (field === "seoImage") {
            setBlogData((prevData) => ({
              ...prevData,
              seo: {
                ...prevData.seo,
                image: existingImageURL,
              },
            }));
          }
          return;
        } catch (error) {
          if (error.code === "storage/object-not-found") {
            console.log("Uploading new image...");
          } else {
            throw error;
          }
        }

        // Upload new image
        await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(imageRef);
        console.log("Uploaded new image:", downloadURL);

        if (field === "image") {
          setBlogData((prevData) => ({
            ...prevData,
            image: downloadURL,
          }));
        } else if (field === "seoImage") {
          setBlogData((prevData) => ({
            ...prevData,
            seo: {
              ...prevData.seo,
              image: downloadURL,
            },
          }));
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image. Please try again.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("seo")) {
      setBlogData((prevData) => ({
        ...prevData,
        seo: {
          ...prevData.seo,
          [name.replace("seo", "").toLowerCase()]: type === "checkbox" ? checked : value,
        },
      }));
      } else if (name === "slug") {
      const formattedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setBlogData({ ...blogData, [name]: formattedSlug });
    } else {
      setBlogData({
        ...blogData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleEditorChange = (value) => {
    setBlogData({
      ...blogData,
      editorDescription: value,
    });
  };

  
  const handleTagsChange = (e) => {
    const value = e.target.value;
    const tagsArray = value.split(",").map((tag) => tag.trim().toLowerCase());
    setBlogData({ ...blogData, tags: tagsArray });
  };
  const handleTagsAdd = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const newTag = e.target.value.trim().toLowerCase();
      if (!blogData.tags.includes(newTag)) {
        setBlogData({
          ...blogData,
          tags: [...blogData.tags, newTag],
        });
      }
      e.target.value = "";
    }
  };
  

  const removeTag = (tagToRemove) => {
    setBlogData({
      ...blogData,
      tags: blogData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const validateData = () => {
    const { title, description, summary, category, tags, seo } = blogData;

    if (!title || !description || !summary || !category) {
      toast.error("All required fields must be filled.");
      return false;
    }
    if (tags.length === 0) {
      toast.error("At least one tag must be added.");
      return false;
    }
    if (!seo.title || !seo.description || !seo.image) {
      toast.error("All SEO fields must be filled.");
      return false;
    }
    return true;
  };

  const handleSeoKeywordsAdd = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const newKeyword = e.target.value.trim();
      setBlogData((prev) => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, newKeyword],
        },
      }));
      e.target.value = "";
    }
  };

  const removeSeoKeyword = (keywordToRemove) => {
    setBlogData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter((kw) => kw !== keywordToRemove),
      },
    }));
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateData()) return;
    console.log("Blog Data Submitted:", blogData);

    const endpoint = selectedBlog
      ? `/api/blogs/updateBlog`
      : "/api/blogs/addBlog";

    const method = selectedBlog ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
    });

    if (response.ok) {
      toast.success("Blog successfully added!");
        setBlogData({
          title: "",
          slug: "",
          description: "",
          summary: "",
          isFeatured: false,
          image: "",
          category: "",
          tags: [],
          seo: {
            title: "",
            description: "",
            author: "",
            image: "",
            keywords: [],
          },  
          editorDescription: "",
        });
        handleBackToList()
    } else {
      toast.error("Failed to add blog!");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-md shadow-md">
      <button
        onClick={handleBackToList}
        className="text-sm flex items-center gap-2 text-black mb-6 font-semibold"
      >
        <FaArrowLeft /> Back
      </button>

      <form onSubmit={handleSubmit} onKeyDown={(e) => handleKeyDown(e)}  className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={blogData.title}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              placeholder="Blog title"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Slug</label>
            <input
              type="text"
              name="slug"
              value={blogData.slug}
              onChange={handleInputChange}
              className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
              placeholder="Slug (e.g., blog-title)"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={blogData.description}
              onChange={handleInputChange}
              className="w-full border rounded p-2 h-24"
              placeholder="description"
            ></textarea>
          </div>
          <div>
            <label className="block font-medium text-gray-700">Summary</label>
            <textarea
              name="summary"
              value={blogData.summary}
              onChange={handleInputChange}
              className="w-full border rounded p-2 h-24"
              placeholder="summary"
            ></textarea>
          </div>
        </div>

        {/* Featured Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            checked={blogData.isFeatured}
            onChange={handleInputChange}
          />
          <label className="text-gray-700">Featured</label>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Content</label>
          <ReactQuill
            theme="snow"
            value={blogData.editorDescription}
            onChange={handleEditorChange}
            className="h-64 rounded mb-20"
            placeholder="Write the blog content here..."
          />
        </div>

        <div>
            <label className="block font-medium text-gray-700">Tags</label>
            <input
              type="text"
              className="flex-grow border p-2 w-full"
              placeholder="Add a tag and press Enter"
              onKeyDown={handleTagsAdd}
            />
            <div className="mt-2 flex gap-2 flex-wrap">
              {blogData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                >
                  {tag}{" "}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-red-500"
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={blogData.category}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              placeholder="Blog category"
            />
          </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Featured Image Upload */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <div className="border border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center relative">
              {blogData.image ? (
                <img
                  src={blogData.image}
                  alt="Featured"
                  className="h-32 w-full object-cover rounded-md"
                />
              ) : (
                <>
                  <FaUpload className="text-gray-500 text-4xl mb-2" />
                  <p className="text-gray-500 text-sm">Upload Featured Image</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleImageUpload(e, "image")}
              />
            </div>
          </div>

          {/* SEO Image Upload */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">SEO Image</label>
            <div className="border border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center relative">
              {blogData.seo.image ? (
                <img
                  src={blogData.seo.image}
                  alt="SEO"
                  className="h-32 w-full object-cover rounded-md"
                />
              ) : (
                <>
                  <FaUpload className="text-gray-500 text-4xl mb-2" />
                  <p className="text-gray-500 text-sm">Upload SEO Image</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleImageUpload(e, "seoImage")}
              />
            </div>
          </div>
        </div>

        {/* SEO Fields */}
        <h3 className="text-lg font-medium text-gray-700 mt-10">SEO Data</h3>
        <div className="space-y-6">
          <div>
            <label className="block font-medium text-gray-700">SEO Title</label>
            <input
              type="text"
              name="seoTitle"
              value={blogData.seo.title}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              placeholder="SEO Title"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">SEO Description</label>
            <input
              type="text"
              name="seoDescription"
              value={blogData.seo.description}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              placeholder="SEO Description"
            />
          </div>
          <div>
          <label className="block font-medium text-gray-700">SEO Keywords</label>
          <div className="flex flex-wrap gap-2">
            {blogData.seo.keywords.map((keyword, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {keyword}
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => removeSeoKeyword(keyword)}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Press Enter to add a keyword"
            className="w-full border rounded p-2 mt-2"
            onKeyDown={handleSeoKeywordsAdd}
          />
        </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-[#695d56] text-white py-2 px-6 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
