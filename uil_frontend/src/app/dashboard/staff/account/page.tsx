"use client";

import React, { useState, ChangeEvent } from "react";
import { User, Mail, MapPin, Save, Camera, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function StaffProfilePage() {
  const [profileData, setProfileData] = useState({
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    phone: "+1 555-0101",
    department: "Computer Science",
    rank: "professor",
    qualification: "PhD in Artificial Intelligence",
    office: "Building A, Room 305",
    researchInterests: "Machine Learning, Computer Vision, AI Ethics",
    bio: "Dr. Sarah Johnson is a Professor of Computer Science with over 15 years of experience in AI. Her research focuses on practical industrial solutions.",
  });

  const [expertise, setExpertise] = useState([
    "Machine Learning",
    "Deep Learning",
    "Computer Vision",
    "NLP",
  ]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6 mx-auto pb-10 max-w-6xl">
      {/* Simple Header */}
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 pb-6 border-b">
        <div>
          <h1 className="font-bold text-foreground text-3xl tracking-tight">
            My Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your university and industry presence.
          </p>
        </div>
        <Button
          onClick={() => console.log(profileData)}
          className="shadow-md px-6 rounded-xl font-bold"
        >
          <Save className="mr-2 w-4 h-4" /> Save Changes
        </Button>
      </div>

      <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm p-6 border-border/50 rounded-3xl text-center">
            <div className="relative mx-auto mb-4 w-28 h-28">
              <div className="flex justify-center items-center bg-primary/10 border-2 border-primary/20 rounded-full w-full h-full">
                <User className="w-12 h-12 text-primary" />
              </div>
              <button className="right-0 bottom-0 absolute bg-background hover:bg-accent shadow-sm p-1.5 border rounded-full transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="font-bold text-xl">{profileData.name}</h2>
            <p className="font-semibold text-primary text-xs uppercase tracking-wider">
              {profileData.rank}
            </p>

            <div className="space-y-3 mt-6 text-left">
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail className="w-4 h-4" /> {profileData.email}
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" /> {profileData.office}
              </div>
            </div>

            <div className="gap-2 grid grid-cols-2 mt-6 pt-6 border-t border-dashed">
              <div className="text-center">
                <p className="font-bold text-lg">17</p>
                <p className="text-[10px] text-muted-foreground uppercase">
                  Projects
                </p>
              </div>
              <div className="text-center">
                <p className="font-bold text-emerald-600 text-lg">96%</p>
                <p className="text-[10px] text-muted-foreground uppercase">
                  Success
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Details Card */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="shadow-sm border-border/50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-accent/5 px-8 py-6 border-border/40 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                Details & Expertise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground text-xs uppercase tracking-wide">
                    Academic Rank
                  </label>
                  <Select
                    value={profileData.rank}
                    onValueChange={(val) =>
                      setProfileData((p) => ({ ...p, rank: val }))
                    }
                  >
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professor">Professor</SelectItem>
                      <SelectItem value="associate-professor">
                        Associate Professor
                      </SelectItem>
                      <SelectItem value="assistant-professor">
                        Assistant Professor
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground text-xs uppercase tracking-wide">
                    Qualification
                  </label>
                  <Input
                    name="qualification"
                    value={profileData.qualification}
                    onChange={handleInputChange}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground text-xs uppercase tracking-wide">
                  Biography
                </label>
                <Textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="rounded-xl resize-none"
                />
              </div>

              {/* Integrated Expertise Section */}
              <div className="space-y-3 pt-4 border-t">
                <label className="font-bold text-muted-foreground text-xs uppercase tracking-wide">
                  Areas of Expertise
                </label>
                <div className="flex flex-wrap gap-2">
                  {expertise.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 border border-border/40 rounded-lg font-medium"
                    >
                      {skill}
                      <button className="ml-2 hover:text-destructive">
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-dashed rounded-lg h-7 text-xs"
                  >
                    <Plus size={14} className="mr-1" /> Add
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground text-xs uppercase tracking-wide">
                  Research Interests
                </label>
                <Input
                  name="researchInterests"
                  value={profileData.researchInterests}
                  onChange={handleInputChange}
                  className="rounded-xl h-11"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
