"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdRefresh, MdEdit } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/firebase";
import toast from "react-hot-toast";

const GraphicsPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("upload");
  const [currentEdit, setCurrentEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [graphicsData, setGraphicsData] = useState([]);
  const [archives, setArchives] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");  
  const storage = getStorage(app);

  const openModal = (type = "upload") => {
    setModalType(type);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setCurrentEdit(null);
  };

  const fetchGraphics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/graphics/getGraphics");
      if (!res.ok) throw new Error("Failed to fetch graphics.");
      const data = await res.json();
      setGraphicsData(data);
    } catch (error) {
      console.error("Error fetching graphics:", error);
      alert("Error fetching graphics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchArchives = async () => {
    try {
      const res = await fetch("/api/archive/getArchive");
      if (!res.ok) throw new Error("Failed to fetch archives.");
      const data = await res.json();
      setArchives(data);
    } catch (error) {
      console.error("Error fetching archives:", error);
      alert("Error fetching archives. Please try again.");
    }
  };

  const handleEditGraphic = (graphic) => {
    setCurrentEdit(graphic);
    openModal("edit");
  };

  const handleSaveEdit = async () => {
    if (!currentEdit) return;
  
    try {
      const res = await fetch(`/api/graphics/editGraphics`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentEdit),
      });
  
      if (!res.ok) throw new Error("Failed to save changes.");
  
      setGraphicsData(prevData => 
        prevData.map(item => 
          item.id === currentEdit.id ? { ...item, ...currentEdit } : item
        )
      );
  
      toast.success("Changes saved successfully!");
      fetchGraphics();
      closeModal();
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes. Please try again.");
    }
  };
  

  const handleArchiveSelect = (archive) => {
    setCurrentEdit({
      title: archive.title || "New Graphic",
      screenName: archive.screenName || "Home",
      imageUrl: archive.imageUrl,
    });
    setModalType("upload");
  };  

  const handleFileUpload = async (e) => {
    try {
      setUploadLoading(true);
      const file = e.target.files[0];
      if (!file) {
        alert("No file selected.");
        return;
      }

      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop();
      const uniqueFileName = `${timestamp}.${fileExtension}`;
      const imageRef = ref(storage, `/graphics/${uniqueFileName}`);
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);
      const addArchiveResponse = await fetch("/api/archive/addArchive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      setArchives(prevData => [
        ...prevData,
        {
          imageUrl: imageUrl,
        }
      ])
      if (!addArchiveResponse.ok) throw new Error("Error saving to archive.");
      setCurrentEdit({ ...currentEdit, imageUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphics();
    fetchArchives();
  }, []);

  const saveToBackend = async () => {
    if (!currentEdit || !currentEdit.title || !currentEdit.screenName || !currentEdit.imageUrl) {
      toast.error("All fields are required");
      return;
    }
  
    const serializableData = {
      title: currentEdit.title,
      imageUrl: currentEdit.imageUrl,
      screenName: currentEdit.screenName,
    };
  
    try {
      const addGraphicsResponse = await fetch("/api/graphics/addGraphics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serializableData),
      });
  
      if (!addGraphicsResponse.ok) throw new Error("Error saving graphic.");

      const addGraphicsData = await addGraphicsResponse.json();
      const graphicId = addGraphicsData.id;
  
      setGraphicsData(prevData => [
        ...prevData,
        {
          id: graphicId,
          title: currentEdit.title,
          imageUrl: currentEdit.imageUrl,
          screenName: currentEdit.screenName,
        }
      ]);
      toast.success("Graphic added successfully!");
      closeModal();
    } catch (error) {
      console.error("Error saving to backend:", error);
      alert("Failed to save graphic. Please try again.");
    }
  };

  const filteredGraphics = graphicsData.filter((graphic) => 
    graphic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = () => {
    setSearchQuery("")
    fetchGraphics();
    setCurrentEdit(null)
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Graphics</h1>
        <div className="flex items-center">
          <Button onClick={() => openModal()} className="bg-[#695d56] text-white">
            Add New Graphic
          </Button>
          <Input 
            placeholder="Search"
            className="mx-4 bg-[#F3EAE7] text-[#85716B]"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleRefresh} className="flex items-center gap-2">
            {loading ? <ClipLoader size={20} color="#85716B" /> : <MdRefresh />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredGraphics.map((graphic) => (
          <div key={graphic.id} className="bg-white rounded-lg shadow-md p-4">
            <img src={graphic.imageUrl} alt={graphic.title} className="w-full h-36 rounded-lg object-cover" />
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">{graphic.title}</span>
              <button onClick={() => handleEditGraphic(graphic)} className="text-gray-500 hover:text-gray-800">
                <MdEdit />
              </button>
            </div>
          </div>
        ))}
      </div>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-[99] bg-gray-800 bg-opacity-50 flex justify-center items-center"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg p-8 w-full max-w-3xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center gap-6 mb-6">
                <button
                  onClick={() => setModalType("archives")}
                  className={`px-6 py-2 rounded-lg font-semibold ${
                    modalType === "archives"
                      ? "bg-blue-500 text-white shadow"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setModalType("upload")}
                  className={`px-6 py-2 rounded-lg font-semibold ${
                    modalType === "upload"
                      ? "bg-blue-500 text-white shadow"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Upload
                </button>
              </div>

              {modalType === "upload" ? (
                <>
                  <h2 className="text-xl font-semibold mb-4 text-center">Upload New Graphic</h2>
                  <div className="flex flex-col gap-4">
                    <Input
                      type="text"
                      placeholder="Enter Title"
                      value={currentEdit?.title || ""}
                      onChange={(e) =>
                        setCurrentEdit({ ...currentEdit, title: e.target.value })
                      }
                      className="border rounded-lg p-3"
                    />
                    <Input
                      type="text"
                      placeholder="Enter Screen Name"
                      value={currentEdit?.screenName || ""}
                      onChange={(e) =>
                        setCurrentEdit({ ...currentEdit, screenName: e.target.value })
                      }
                      className="border rounded-lg p-3"
                    />
                    <div
                      className="flex flex-col items-center justify-center border-dashed border-2 border-gray-300 rounded-lg p-8 cursor-pointer relative hover:border-blue-500"
                    >
                      <input
                        id="fileInput"
                        type="file"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {currentEdit?.imageUrl ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={currentEdit.imageUrl}
                            alt="Selected Graphic"
                            className="h-32 w-32 object-cover rounded-md"
                          />
                          <p className="text-gray-500 mt-2">Click to change the image</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-500">Drag & drop an image here or click to upload</p>
                          <p className="text-blue-500 mt-2 underline">Browse Files</p>
                        </>
                      )}
                    </div>

                    {uploadLoading && <ClipLoader size={20} color="#695d56" />}
                    <div className="flex justify-end mt-2">
                    <Button
                      onClick={saveToBackend}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Save
                    </Button>
                  </div>
                  </div>
                </>
              ) : modalType === "archives" ? (
                <>
                  <h2 className="text-xl font-semibold mb-4 text-center">Select from Archives</h2>
                  {archives.length > 0 ? (
                    <div className="max-h-1/2 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        {archives.map((archive) => (
                          <div
                            key={archive.id}
                            className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
                            onClick={() => handleArchiveSelect(archive)}
                          >
                            <img
                              src={archive.imageUrl || currentEdit.imageUrl}
                              alt="Archive"
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center">No archive images available.</p>
                  )}
                </>

              ) : modalType === "edit" && currentEdit && (
                <>
                  <h2 className="text-xl font-semibold mb-4 text-center">Edit Graphic</h2>
                  <div className="flex flex-col gap-4">
                    <Input
                      type="text"
                      placeholder="Enter Title"
                      value={currentEdit.title || ""}
                      onChange={(e) =>
                        setCurrentEdit({ ...currentEdit, title: e.target.value })
                      }
                      className="border rounded-lg p-3"
                    />
                    <Input
                      type="text"
                      placeholder="Enter Screen Name"
                      value={currentEdit.screenName || ""}
                      onChange={(e) =>
                        setCurrentEdit({ ...currentEdit, screenName: e.target.value })
                      }
                      className="border rounded-lg p-3"
                    />
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={handleSaveEdit}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Save Changes
                    </Button>
                  </div>
                </>
              )}

              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default GraphicsPage;