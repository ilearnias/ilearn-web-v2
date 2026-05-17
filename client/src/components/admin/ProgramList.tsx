import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Program } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash2, Plus, ExternalLink, ArrowUpDown } from "lucide-react";
import ProgramForm from "@/components/admin/ProgramForm";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function ProgramList() {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch programs
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ["admin/programs"],
    queryFn: () => apiRequest<Program[]>({ url: "admin/programs" }),
  });

  // Handle delete program
  const handleDelete = async (id: number) => {
    try {
      await apiRequest({ url: `admin/programs/${id}`, method: "DELETE" });
      queryClient.invalidateQueries({ queryKey: ["admin/programs"] });
      toast({
        title: "Success",
        description: "Program deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete program",
        variant: "destructive",
      });
    }
  };

  const sortedPrograms = [...programs].sort((a, b) => {
    // First sort by displayOrder if it exists
    if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
      return (a.displayOrder || 999) - (b.displayOrder || 999);
    }
    // If one has displayOrder and the other doesn't, prioritize the one with displayOrder
    if (a.displayOrder !== undefined) return -1;
    if (b.displayOrder !== undefined) return 1;
    // Finally sort by id as fallback
    return a.id - b.id;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Program List</h3>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogTitle>Add New Program</DialogTitle>
            <ProgramForm
              onSuccess={() => {
                setIsAddDialogOpen(false);
                queryClient.invalidateQueries({ queryKey: ["admin/programs"] });
                toast({
                  title: "Success",
                  description: "Program added successfully",
                });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-4 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin"></div>
        </div>
      ) : sortedPrograms.length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-1">No programs found</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first program.</p>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-primary-blue hover:bg-primary-blue-600"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Program
          </Button>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 p-4 text-sm font-medium text-gray-500">
            <div className="col-span-4">Program</div>
            <div className="col-span-2">Duration</div>
            <div className="col-span-2">Fees</div>
            <div className="col-span-2">Order</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          
          {sortedPrograms.map((program, index) => (
            <div key={program.id} className="border-t border-gray-200">
              <div className="grid grid-cols-12 p-4 hover:bg-gray-50 items-center">
                <div className="col-span-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-blue-50 rounded-full flex items-center justify-center">
                      <i className={`${program.icon} text-primary-blue text-lg`}></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{program.title}</h4>
                      <p className="text-xs text-gray-500 truncate max-w-[250px]">
                        {program.slug}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 text-sm">{program.duration}</div>
                <div className="col-span-2 text-sm">{program.fees}</div>
                <div className="col-span-2 text-sm">
                  <Badge variant="outline" className="bg-gray-50">
                    {program.displayOrder || index + 1}
                  </Badge>
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <a 
                    href={`/programs/${program.slug}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-700"
                    title="View Program"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  
                  <Dialog
                    open={editingProgram?.id === program.id}
                    onOpenChange={(open) => {
                      if (!open) setEditingProgram(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setEditingProgram(program)}
                        className="text-gray-400 hover:text-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogTitle>Edit Program - {program.title}</DialogTitle>
                      <ProgramForm
                        program={program}
                        onSuccess={() => {
                          setEditingProgram(null);
                          queryClient.invalidateQueries({ queryKey: ["admin/programs"] });
                          toast({
                            title: "Success",
                            description: "Program updated successfully",
                          });
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <AlertDialog
                    open={isDeleteAlertOpen && deleteId === program.id}
                    onOpenChange={(open) => {
                      setIsDeleteAlertOpen(open);
                      if (!open) setDeleteId(null);
                    }}
                  >
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => {
                          setDeleteId(program.id);
                          setIsDeleteAlertOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Program</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{program.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => handleDelete(program.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
