import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ResumeUpload from "./ResumeUpload";
import JobDescription from "./JobDescription";
import { useState, useContext } from "react";
import axios from "axios";
import { Loader2, Plus } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetailContext } from "@/context/UserDetailProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function CreateInterviewDialog() {
  const [formData, setFormData] = useState<any>();
  const [file, setFile] = useState<File | null>(); // State lưu file
  const [loading, setLoading] = useState(false);
  const { userDetails } = useContext(UserDetailContext);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("resume-upload");

  const saveInterviewQuestion = useMutation(
    api.interview.saveInterviewQuestion
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async () => {
    setLoading(true);
    const formData_ = new FormData();
    formData_.append("file", file ?? "");
    formData_.append("jobDescription", formData?.jobDescription);
    formData_.append("jobTitle", formData?.jobTitle);

    try {
      const res = await axios.post(
        "/api/generate-interview-question",
        formData_
      );

      if (res?.data?.status === 429) {
        toast.warning(res?.data?.result);
        return;
      }

      const resp = await saveInterviewQuestion({
        questions: res?.data.questions,
        resumeUrl: res?.data.resumeUrl ?? "",
        uid: userDetails?._id,
        jobTitle: formData?.jobTitle ?? "",
        jobDescription: formData?.jobDescription ?? "",
      });
      setOpen(false);
      router.push(`/interview/${resp}`);
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = () => {
    if (loading) return true;
    if (activeTab === "resume-upload") return !file;
    if (activeTab === "job-description")
      return !(formData?.jobTitle && formData?.jobDescription);
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:brightness-110 border-0 transition-all text-white shadow-lg shadow-violet-500/20">
          <Plus className="mr-2 h-4 w-4" /> Create Interview
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Interview
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Choose how you want to generate your interview questions.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-slate-950 border border-white/5">
              <TabsTrigger
                value="resume-upload"
                className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-slate-400"
              >
                From Resume
              </TabsTrigger>
              <TabsTrigger
                value="job-description"
                className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-slate-400"
              >
                From Job Desc
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resume-upload">
              {/* SỬA CHỖ NÀY: Truyền cả file và setFile xuống */}
              <ResumeUpload
                file={file}
                setFiles={(f: File) => setFile(f)} // Giữ tên prop cũ là setFiles nếu component ResumeUpload bạn chưa đổi tên prop, hoặc đổi thành setFile như code mới tôi đưa
                setFile={setFile} // Dùng dòng này nếu bạn copy code ResumeUpload mới của tôi
              />
            </TabsContent>

            <TabsContent value="job-description">
              <JobDescription handleInputChange={handleInputChange} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isButtonDisabled()}
            className="bg-violet-600 hover:bg-violet-500 text-white min-w-[100px] disabled:bg-slate-700 disabled:text-slate-500"
          >
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Start Interview"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateInterviewDialog;
