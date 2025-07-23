import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ProgramList from "./ProgramList";
import ProgramOrderEditor from "./ProgramOrderEditor";
import HomeProgramTeaserEditor from "./HomeProgramTeaserEditor";

export default function ProgramsEditor() {
  const [activeTab, setActiveTab] = useState<string>("list");
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Programs</CardTitle>
          <CardDescription>
            Create, edit, and manage programs offered by the academy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="list" className="text-xs sm:text-sm">Program List</TabsTrigger>
              <TabsTrigger value="order" className="text-xs sm:text-sm">Program Order</TabsTrigger>
              <TabsTrigger value="homepage" className="text-xs sm:text-sm">Homepage Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <ProgramList />
            </TabsContent>
          
            <TabsContent value="order">
              <ProgramOrderEditor />
            </TabsContent>
          
            <TabsContent value="homepage">
              <HomeProgramTeaserEditor />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 text-sm text-gray-600 px-6 py-3">
          <p>Changes to programs will be reflected on the website immediately.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
