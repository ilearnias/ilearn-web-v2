import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Program } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GripVertical, Save, Loader2 } from "lucide-react";

export default function ProgramOrderEditor() {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<Program[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch programs
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ["/api/programs"],
    queryFn: () => apiRequest<Program[]>({ url: "/api/programs" }),
  });
  
  // Update items when programs data changes
  useEffect(() => {
    if (programs.length > 0) {
      // Sort by display order if available, otherwise by id
      const sortedData = [...programs].sort((a, b) => {
        if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
          return (a.displayOrder || 999) - (b.displayOrder || 999);
        }
        // If one has displayOrder and the other doesn't, prioritize the one with displayOrder
        if (a.displayOrder !== undefined) return -1;
        if (b.displayOrder !== undefined) return 1;
        // Default to id sort
        return a.id - b.id;
      });
      setItems(sortedData);
    }
  }, [programs]);

  // Handle drag and drop
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedItems = [...items];
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    // Update items with new order
    setItems(reorderedItems);
  };

  // Save the new order
  const saveOrder = async () => {
    setIsSaving(true);
    
    try {
      // Create an array of program ids with their new display order
      const updatedPrograms = items.map((program, index) => ({
        id: program.id,
        displayOrder: index + 1,
      }));

      // Send the update request
      await apiRequest({
        url: "/api/programs/order",
        method: "PATCH",
        data: { programs: updatedPrograms },
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });

      toast({
        title: "Order updated",
        description: "Program order has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating program order:", error);
      toast({
        title: "Error",
        description: "There was a problem updating the program order",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Program Display Order</h3>
          <p className="text-sm text-gray-500">
            Drag and drop programs to change their display order on the Programs page
          </p>
        </div>

        <Button onClick={saveOrder} disabled={isLoading || isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Order
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-4 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-1">No programs found</h3>
          <p className="text-gray-500">Add programs from the Program List tab first.</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="programs">
            {(provided) => (
              <div
                className="border border-gray-200 rounded-md overflow-hidden"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {items.map((program, index) => (
                  <Draggable key={program.id} draggableId={String(program.id)} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-4 bg-white border-t border-gray-200 ${index === 0 ? 'border-t-0' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab text-gray-400 hover:text-gray-600"
                          >
                            <GripVertical size={20} />
                          </div>

                          <div className="flex-shrink-0 w-10 h-10 bg-primary-blue-50 rounded-full flex items-center justify-center">
                            <i className={`${program.icon} text-primary-blue text-lg`}></i>
                          </div>

                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{program.title}</h4>
                            <p className="text-xs text-gray-500 truncate max-w-[250px]">
                              {program.description.substring(0, 80)}...
                            </p>
                          </div>

                          <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200">
                            <span className="text-sm font-medium">{index + 1}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded border border-gray-100">
        <p>The order set here affects how programs are displayed on the Programs page. To feature programs on the homepage, use the Homepage Features tab.</p>
      </div>
    </div>
  );
}
