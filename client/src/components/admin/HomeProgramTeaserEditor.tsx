import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Program } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GripVertical, Save, Loader2, CheckCircle, Circle } from "lucide-react";

// Add isHomePageFeatured property to the Program type
type EnhancedProgram = Program & {
  isHomePageFeatured?: boolean;
};

export default function HomeProgramTeaserEditor() {
  const queryClient = useQueryClient();
  const [selectedPrograms, setSelectedPrograms] = useState<EnhancedProgram[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all programs
  const { data: allPrograms = [], isLoading: programsLoading } = useQuery({
    queryKey: ["/api/programs"],
    queryFn: () => apiRequest<Program[]>({ url: "/api/programs" }),
  });

  // Fetch featured home programs setting
  const { data: featuredSetting, isLoading: settingsLoading } = useQuery({
    queryKey: ["/api/settings/featured_home_programs"],
    queryFn: () => apiRequest({ url: "/api/settings/featured_home_programs" }),
  });

  // Initialize selected programs when data is loaded
  useEffect(() => {
    if (allPrograms.length > 0 && featuredSetting) {
      try {
        // Parse the featured program IDs from the setting
        const featuredIds = JSON.parse(featuredSetting.value || "[]");
        
        // Filter programs by these IDs and maintain their order
        const featured = featuredIds
          .map((id: number) => allPrograms.find(p => p.id === id))
          .filter(Boolean) as Program[];
          
        // Add any remaining programs that aren't featured to the end
        const notFeatured = allPrograms.filter(p => !featuredIds.includes(p.id));
        
        // Mark featured programs
        const enhancedFeatured = featured.map(program => ({
          ...program,
          isHomePageFeatured: true
        }));
        
        // Mark non-featured programs
        const enhancedNotFeatured = notFeatured.map(program => ({
          ...program,
          isHomePageFeatured: false
        }));
        
        setSelectedPrograms([...enhancedFeatured, ...enhancedNotFeatured]);
      } catch (e) {
        console.error("Error parsing featured programs:", e);
        // Initialize with non-featured programs
        const enhancedPrograms = allPrograms.map(program => ({
          ...program,
          isHomePageFeatured: false
        }));
        setSelectedPrograms(enhancedPrograms);
      }
    }
  }, [allPrograms, featuredSetting]);

  // Handle drag and drop
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedItems = [...selectedPrograms];
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setSelectedPrograms(reorderedItems);
  };

  // Toggle program selection for homepage feature
  const toggleProgramSelection = (programId: number) => {
    setSelectedPrograms(prevPrograms => {
      return prevPrograms.map(program => {
        if (program.id === programId) {
          // Toggle the isHomePageFeatured property
          return {
            ...program,
            isHomePageFeatured: !program.isHomePageFeatured
          };
        }
        return program;
      });
    });
  };

  // Save the homepage featured programs
  const saveHomepageFeatures = async () => {
    setIsSaving(true);
    
    try {
      // Get IDs of featured programs in order
      const featuredIds = selectedPrograms
        .filter(p => p.isHomePageFeatured)
        .map(p => p.id);

      // Save to site settings
      await apiRequest({
        url: "/api/settings/featured_home_programs",
        method: "PUT",
        data: { value: JSON.stringify(featuredIds) },
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/settings/featured_home_programs"] });

      toast({
        title: "Homepage features updated",
        description: "Featured programs have been updated successfully",
      });
    } catch (error) {
      console.error("Error updating homepage features:", error);
      toast({
        title: "Error",
        description: "There was a problem updating the homepage features",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = programsLoading || settingsLoading;
  const featuredCount = selectedPrograms.filter(p => p.isHomePageFeatured).length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Homepage Program Teasers</h3>
          <p className="text-sm text-gray-500">
            Select and arrange programs to be featured on the homepage
          </p>
        </div>

        <Button onClick={saveHomepageFeatures} disabled={isLoading || isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Features
            </>
          )}
        </Button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm">
        <p className="flex items-start gap-2">
          <span className="flex-shrink-0 pt-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span>
            <strong>Tip:</strong> Select programs to feature on the homepage and drag to change their order. The first {featuredCount > 0 ? featuredCount : 3} selected programs will be displayed on the homepage.
          </span>
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-4 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin"></div>
        </div>
      ) : selectedPrograms.length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-1">No programs found</h3>
          <p className="text-gray-500">Add programs from the Program List tab first.</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="home-programs">
            {(provided) => (
              <div
                className="border border-gray-200 rounded-md overflow-hidden"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {selectedPrograms.map((program, index) => (
                  <Draggable key={program.id} draggableId={String(program.id)} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-4 border-t border-gray-200 ${index === 0 ? 'border-t-0' : ''} ${
                          program.isHomePageFeatured ? 'bg-primary-blue-50' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab text-gray-400 hover:text-gray-600"
                          >
                            <GripVertical size={20} />
                          </div>

                          <div
                            className="cursor-pointer"
                            onClick={() => toggleProgramSelection(program.id)}
                          >
                            {program.isHomePageFeatured ? (
                              <CheckCircle className="h-5 w-5 text-primary-blue" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-300" />
                            )}
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

                          {program.isHomePageFeatured && (
                            <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center border border-primary-blue">
                              <span className="text-sm font-medium text-primary-blue">
                                {selectedPrograms.filter(p => p.isHomePageFeatured).findIndex(p => p.id === program.id) + 1}
                              </span>
                            </div>
                          )}
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
        <p>The selected programs will be displayed as teasers on the homepage. To change the order of all programs on the Programs page, use the Program Order tab.</p>
      </div>
    </div>
  );
}
