import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, X } from "lucide-react";

interface Topic {
  id: number;
  name: string;
  course: string;
  video: boolean;
  videoLink?: string;
  content?: string;
  date: string;
}

const AdminTopics = () => {
  const [topics, setTopics] = useState<Topic[]>([
    { id: 1, name: "Kirish", course: "JavaScript", video: true, videoLink: "https://youtube.com/...", content: "JavaScript haqida kirish", date: "2025-01-10" },
    { id: 2, name: "O'zgaruvchilar", course: "JavaScript", video: true, videoLink: "https://youtube.com/...", content: "O'zgaruvchilar nima", date: "2025-01-12" },
    { id: 3, name: "Massivlar", course: "JavaScript", video: false, content: "Massivlar qanday ishlaydi", date: "2025-01-15" },
    { id: 4, name: "Selektorlar", course: "CSS", video: true, videoLink: "https://youtube.com/...", content: "CSS selektorlari", date: "2025-01-18" },
    { id: 5, name: "Flexbox", course: "CSS", video: true, videoLink: "https://youtube.com/...", content: "Flexbox layout", date: "2025-01-20" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    course: "JavaScript",
    videoLink: "",
    content: "",
    video: false,
  });

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (topic?: Topic) => {
    if (topic) {
      setEditingId(topic.id);
      setFormData({
        name: topic.name,
        course: topic.course,
        videoLink: topic.videoLink || "",
        content: topic.content || "",
        video: topic.video,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        course: "JavaScript",
        videoLink: "",
        content: "",
        video: false,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: "",
      course: "JavaScript",
      videoLink: "",
      content: "",
      video: false,
    });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Mavzu nomini kiritish kerak!");
      return;
    }

    if (editingId) {
      // Update existing topic
      setTopics(topics.map(topic =>
        topic.id === editingId
          ? {
              ...topic,
              name: formData.name,
              course: formData.course,
              video: !!formData.videoLink,
              videoLink: formData.videoLink,
              content: formData.content,
            }
          : topic
      ));
    } else {
      // Add new topic
      const newTopic: Topic = {
        id: Math.max(...topics.map(t => t.id), 0) + 1,
        name: formData.name,
        course: formData.course,
        video: !!formData.videoLink,
        videoLink: formData.videoLink,
        content: formData.content,
        date: new Date().toISOString().split('T')[0],
      };
      setTopics([...topics, newTopic]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu mavzuni o'chirmoqchisiz?")) {
      setTopics(topics.filter(topic => topic.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-[28px] font-bold mb-8">Mavzular boshqaruvi</h1>

        {/* Action bar */}
        <div className="flex items-center justify-between mb-6">
          <Input 
            placeholder="Qidirish..." 
            className="max-w-xs bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={() => handleOpenModal()}>Yangi mavzu qo'shish</Button>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary text-primary text-sm">
                <th className="text-left px-6 py-3 font-medium">#</th>
                <th className="text-left px-6 py-3 font-medium">Mavzu nomi</th>
                <th className="text-left px-6 py-3 font-medium">Kurs</th>
                <th className="text-left px-6 py-3 font-medium">Video</th>
                <th className="text-left px-6 py-3 font-medium">Sana</th>
                <th className="text-left px-6 py-3 font-medium">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopics.map((topic, i) => (
                <tr key={topic.id} className={`border-t border-border ${i % 2 === 0 ? "" : "bg-secondary/30"}`}>
                  <td className="px-6 py-3.5 text-sm text-muted-foreground">{topic.id}</td>
                  <td className="px-6 py-3.5 text-sm">{topic.name}</td>
                  <td className="px-6 py-3.5 text-sm text-muted-foreground">{topic.course}</td>
                  <td className="px-6 py-3.5">
                    {topic.video ? (
                      <span className="inline-flex px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">✓ Bor</span>
                    ) : (
                      <span className="inline-flex px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs">✗ Yo'q</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-muted-foreground">{topic.date}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex gap-2">
                      <button 
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => handleOpenModal(topic)}
                        title="Tahrirlash"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(topic.id)}
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {editingId ? "Mavzuni tahrirlash" : "Yangi mavzu qo'shish"}
                </h3>
                <button 
                  onClick={handleCloseModal} 
                  className="text-muted-foreground hover:text-foreground"
                  title="Yopish"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-foreground text-sm font-medium mb-1.5 block">Mavzu nomi</label>
                  <Input 
                    placeholder="Massivlar" 
                    className="bg-background"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-foreground text-sm font-medium mb-1.5 block">Kursni tanlang</label>
                  <select 
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm"
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                    aria-label="Kursni tanlang"
                  >
                    <option>JavaScript</option>
                    <option>Python</option>
                    <option>HTML</option>
                    <option>CSS</option>
                    <option>React</option>
                    <option>Vue</option>
                  </select>
                </div>
                <div>
                  <label className="text-foreground text-sm font-medium mb-1.5 block">YouTube video link</label>
                  <Input 
                    placeholder="https://youtube.com/..." 
                    className="bg-background"
                    value={formData.videoLink}
                    onChange={(e) => setFormData({...formData, videoLink: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-foreground text-sm font-medium mb-1.5 block">Kontent (matn)</label>
                  <textarea
                    className="w-full h-28 rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Mavzu haqida yozing..."
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={handleCloseModal}>Bekor qilish</Button>
                <Button onClick={handleSave}>{editingId ? "Yangilash" : "Saqlash"}</Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminTopics;
