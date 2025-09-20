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
function CreateInterviewDialog() {
  const [formData, setFormData] = useState<any>();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  console.log(formData);
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
                <ResumeUpload />
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
          <Button>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateInterviewDialog;
