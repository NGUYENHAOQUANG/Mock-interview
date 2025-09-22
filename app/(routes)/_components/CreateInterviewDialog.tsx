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
import { useState } from "react";
import axios from "axios";
function CreateInterviewDialog() {
  const [formData, setFormData] = useState<any>();
  const [file, setFile] = useState<File | null>();
  const [loading, setLoading] = useState(false);
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  console.log(formData);

  const onSubmit = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        "/api/generate-interview-question",
        formData
      );
      console.log(res);
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
          <Button onClick={onSubmit} disabled={loading || !file}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateInterviewDialog;
