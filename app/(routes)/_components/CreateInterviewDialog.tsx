import React, { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ResumeUpload from "./ResumeUpload";
import JobDescription from "./JobDescription";
import { useState, useContext } from "react";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetailContext } from "@/context/UserDetailProvider";

function CreateInterviewDialog() {
  const [formData, setFormData] = useState<any>();
  const [file, setFile] = useState<File | null>();
  const [loading, setLoading] = useState(false);
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const saveInterviewQuestion = useMutation(
    api.interview.saveInterviewQuestion
  );
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  console.log(formData);

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
      console.log(res);

      //save database

      const resp = await saveInterviewQuestion({
        questions: res?.data.questions,
        resumeUrl: res?.data.resumeUrl ?? "",
        uid: userDetails?._id,
      });
      console.log("resp", resp);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="mt-8">+ Create Interview</Button>
      </DialogTrigger>
      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            <Tabs defaultValue="resume-upload" className="w-full mt-5">
              <TabsList>
                <TabsTrigger value="resume-upload">Resume Upload</TabsTrigger>
                <TabsTrigger value="job-description">
                  Job Description
                </TabsTrigger>
              </TabsList>
              <TabsContent value="resume-upload">
                <ResumeUpload
                  setFiles={(file: File) => {
                    setFile(file);
                  }}
                />
              </TabsContent>
              <TabsContent value="job-description">
                <JobDescription handleInputChange={handleInputChange} />
              </TabsContent>
            </Tabs>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="border-2 border-gray-100 rounded-lg w-20 hover:bg-gray-100"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={loading}>
            {loading && <Loader2Icon className="animate-spin" />} Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateInterviewDialog;
