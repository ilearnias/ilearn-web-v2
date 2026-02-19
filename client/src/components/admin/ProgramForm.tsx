import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Program, InsertProgram, ResultYear } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { API } from "@/config/api";
import { useQueryClient } from "@tanstack/react-query";
import { X, Plus, Save, Loader2, ArrowUp, ArrowDown, Upload, Image as ImageIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VideoTestimonialForm from "./VideoTestimonialForm";
import ImageTestimonialForm from "./ImageTestimonialForm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface ProgramFormProps {
  program?: Program;
  onSuccess: () => void;
}

// Used to create faq items
interface FAQ {
  question: string;
  answer: string;
}

// Validate the program form
const programFormSchema = z.object({
  slug: z.string().min(3, { message: "Slug must be at least 3 characters" })
    .regex(/^[a-z0-9-]+$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens" }),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  icon: z.string().min(1, { message: "Icon is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  fees: z.string().min(1, { message: "Fees is required" }),
  video: z.string().optional(),
});

type ProgramFormValues = z.infer<typeof programFormSchema> & {
  // These fields are handled separately
  // usp: string[];
  // testimonials: number[];
  // faq: FAQ[];
};

export default function ProgramForm({ program, onSuccess }: ProgramFormProps) {
  const queryClient = useQueryClient();
  const [uspItems, setUspItems] = useState<string[]>(program?.usp || []);
  const [newUsp, setNewUsp] = useState("");
  const [faqItems, setFaqItems] = useState<FAQ[]>(
    program?.faq as FAQ[] || []
  );
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Result Years state
  const [resultYears, setResultYears] = useState<ResultYear[]>(
    program?.resultYears as ResultYear[] || []
  );
  const [newYear, setNewYear] = useState("");
  const [yearImages, setYearImages] = useState<Record<string, File>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // We no longer need to fetch testimonials since we're not selecting from existing ones
  // Testimonials will be created directly for this program via the Add buttons

  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programFormSchema),
    defaultValues: {
      slug: program?.slug || "",
      title: program?.title || "",
      description: program?.description || "",
      icon: program?.icon || "ri-government-line",
      duration: program?.duration || "",
      fees: program?.fees || "",
      video: program?.video || "",
    },
  });

  // Add USP (unique selling point) item
  const handleAddUsp = () => {
    if (newUsp.trim() && !uspItems.includes(newUsp.trim())) {
      setUspItems([...uspItems, newUsp.trim()]);
      setNewUsp("");
    }
  };

  // Remove USP item
  const handleRemoveUsp = (index: number) => {
    setUspItems(uspItems.filter((_, i) => i !== index));
  };

  // Add FAQ item
  const handleAddFaq = () => {
    if (newFaqQuestion.trim() && newFaqAnswer.trim()) {
      const newFaq: FAQ = {
        question: newFaqQuestion.trim(),
        answer: newFaqAnswer.trim(),
      };
      setFaqItems([...faqItems, newFaq]);
      setNewFaqQuestion("");
      setNewFaqAnswer("");
    }
  };

  // Remove FAQ item
  const handleRemoveFaq = (index: number) => {
    setFaqItems(faqItems.filter((_, i) => i !== index));
  };

  // Add Result Year item
  const handleAddResultYear = () => {
    if (newYear.trim() && !resultYears.some(ry => ry.year === newYear.trim())) {
      const newYearItem: ResultYear = {
        year: newYear.trim(),
        imageUrl: "", // This will be updated when the image is uploaded
        displayOrder: resultYears.length // Add at the end
      };
      setResultYears([...resultYears, newYearItem]);
      setNewYear("");
    }
  };

  // Remove Result Year item
  const handleRemoveResultYear = (index: number) => {
    const yearToRemove = resultYears[index];
    // Remove from state
    setResultYears(resultYears.filter((_, i) => i !== index));
    // Remove from images if it exists
    if (yearImages[yearToRemove.year]) {
      const newYearImages = {...yearImages};
      delete newYearImages[yearToRemove.year];
      setYearImages(newYearImages);
    }
  };

  // Handle file selection for year image
  const handleYearImageChange = (e: React.ChangeEvent<HTMLInputElement>, year: string) => {
    if (e.target.files && e.target.files[0]) {
      // Save file reference
      const newYearImages = {...yearImages};
      newYearImages[year] = e.target.files[0];
      setYearImages(newYearImages);
      
      // Create temp URL for preview
      const tempUrl = URL.createObjectURL(e.target.files[0]);
      setResultYears(resultYears.map(ry => 
        ry.year === year ? {...ry, imageUrl: tempUrl} : ry
      ));
    }
  };

  // Move a year up in the order
  const handleMoveYearUp = (index: number) => {
    if (index === 0) return; // Already at the top
    const newResultYears = [...resultYears];
    [newResultYears[index-1], newResultYears[index]] = [newResultYears[index], newResultYears[index-1]];
    // Update display order
    newResultYears.forEach((year, i) => {
      year.displayOrder = i;
    });
    setResultYears(newResultYears);
  };

  // Move a year down in the order
  const handleMoveYearDown = (index: number) => {
    if (index === resultYears.length - 1) return; // Already at the bottom
    const newResultYears = [...resultYears];
    [newResultYears[index], newResultYears[index+1]] = [newResultYears[index+1], newResultYears[index]];
    // Update display order
    newResultYears.forEach((year, i) => {
      year.displayOrder = i;
    });
    setResultYears(newResultYears);
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(resultYears);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update display order
    items.forEach((year, i) => {
      year.displayOrder = i;
    });
    
    setResultYears(items);
  };

  // No more testimonial selection toggle functions
  // Testimonials will be created specifically for this program using the Add buttons

  // Handle form submission
  const onSubmit = async (values: ProgramFormValues) => {
    if (uspItems.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one USP item is required",
        variant: "destructive",
      });
      return;
    }

    if (faqItems.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one FAQ item is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First, handle file uploads if there are any
      const resultYearsWithImages = [...resultYears];
      const yearImageFiles = Object.keys(yearImages);
      
      if (yearImageFiles.length > 0) {
        for (const year of yearImageFiles) {
          const file = yearImages[year];
          const formData = new FormData();
          formData.append('image', file);
          
          try {
            // Upload the image
            const token = localStorage.getItem('adminToken');
            const uploadResponse = await fetch(API.BASEURL + 'upload/image', {
              method: 'POST',
              headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
              },
              body: formData,
            });
            
            if (!uploadResponse.ok) {
              throw new Error(`Failed to upload image for year ${year}`);
            }
            
            const uploadData = await uploadResponse.json();
            
            // Update the imageUrl in the resultYears array
            const yearIndex = resultYearsWithImages.findIndex(ry => ry.year === year);
            if (yearIndex !== -1) {
              resultYearsWithImages[yearIndex].imageUrl = uploadData.media.mediaUrl;
            }
          } catch (uploadError) {
            console.error(`Error uploading image for year ${year}:`, uploadError);
            toast({
              title: "Image Upload Error",
              description: `Failed to upload image for year ${year}`,
              variant: "destructive",
            });
          }
        }
      }
      
      const programData: Partial<InsertProgram> = {
        ...values,
        usp: uspItems,
        faq: faqItems,
        resultYears: resultYearsWithImages,
        // No longer tracking testimonial selections as they are created directly with the program name
      };

      if (program) {
        // Update existing program
        await apiRequest({
          url: `admin/programs/${program.id}`,
          method: "PATCH",
          data: programData,
        });
      } else {
        // Create new program
        await apiRequest({
          url: "admin/programs",
          method: "POST",
          data: programData,
        });
      }

      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["admin/programs"] });

      // If updating an existing program
      if (program?.id) {
        queryClient.invalidateQueries({ queryKey: [`admin/programs/${program.id}`] });
        queryClient.invalidateQueries({ queryKey: [`admin/programs/${program.slug}`] });
      }
      
      // Force a navigation to the programs list to refresh the view
      setTimeout(() => {
        onSuccess();
      }, 500); // Small delay to ensure cache is updated
    } catch (error) {
      console.error("Error saving program:", error);
      toast({
        title: "Error",
        description: "Failed to save program",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Available icons for programs
  const availableIcons = [
    { icon: "ri-government-line", label: "Government" },
    { icon: "ri-building-line", label: "Building" },
    { icon: "ri-book-open-line", label: "Book" },
    { icon: "ri-graduation-cap-line", label: "Graduation Cap" },
    { icon: "ri-award-line", label: "Award" },
    { icon: "ri-draft-line", label: "Document" },
    { icon: "ri-article-line", label: "Article" },
    { icon: "ri-lightbulb-line", label: "Idea" },
    { icon: "ri-contacts-line", label: "Contact" },
    { icon: "ri-task-line", label: "Task" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. UPSC General Studies" {...field} />
                </FormControl>
                <FormDescription>
                  The name of your program as it will appear on the website
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Slug</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. upsc-general-studies" {...field} />
                </FormControl>
                <FormDescription>
                  The URL-friendly name (e.g. /programs/your-slug)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Icon</FormLabel>
                <FormControl>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <i className={`${field.value} text-base`}></i>
                        <span>
                          {availableIcons.find(i => i.icon === field.value)?.label ||
                            "Select an icon"}
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {availableIcons.map((icon) => (
                        <SelectItem key={icon.icon} value={icon.icon}>
                          <div className="flex items-center gap-2">
                            <i className={`${icon.icon} text-base`}></i>
                            <span>{icon.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Choose an icon to represent your program
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 12 months" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fees</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. ₹85,000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a detailed description of the program..."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. https://www.youtube.com/embed/VideoID" {...field} />
                  </FormControl>
                  <FormDescription>
                    Add a YouTube embed URL for program overview video
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
              <h3 className="text-sm font-medium mb-2">Program Highlights (USP)</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newUsp}
                    onChange={(e) => setNewUsp(e.target.value)}
                    placeholder="Add a unique selling point"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddUsp}
                    variant="outline"
                    size="sm"
                    disabled={!newUsp.trim()}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>

                {uspItems.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {uspItems.map((usp, index) => (
                      <Badge key={index} variant="secondary" className="px-2 py-1 text-xs flex items-center gap-1">
                        {usp}
                        <X
                          className="h-3 w-3 ml-1 cursor-pointer"
                          onClick={() => handleRemoveUsp(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No highlights added yet. Add some unique selling points to make your program stand out.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
              <h3 className="text-sm font-medium mb-2">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <div className="grid gap-3">
                  <Input
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                    placeholder="Question"
                  />
                  <Textarea
                    value={newFaqAnswer}
                    onChange={(e) => setNewFaqAnswer(e.target.value)}
                    placeholder="Answer"
                    className="min-h-16"
                  />
                  <Button
                    type="button"
                    onClick={handleAddFaq}
                    variant="outline"
                    size="sm"
                    disabled={!newFaqQuestion.trim() || !newFaqAnswer.trim()}
                    className="justify-self-end"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add FAQ
                  </Button>
                </div>

                {faqItems.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {faqItems.map((faq, index) => (
                      <div
                        key={index}
                        className="bg-white p-3 rounded border border-gray-200 relative group"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(index)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <h4 className="font-medium text-sm">{faq.question}</h4>
                        <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
              <h3 className="text-sm font-medium mb-2">Program Results by Year</h3>
              <p className="text-sm text-gray-500 mb-4">
                Add years with images to showcase program results. These will appear in the year tabs on the program detail page.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="Enter year (e.g. 2025)"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddResultYear}
                    variant="outline"
                    size="sm"
                    disabled={!newYear.trim() || resultYears.some(ry => ry.year === newYear.trim())}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Year
                  </Button>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  id="year-image-input" 
                />
                
                {resultYears.length > 0 ? (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="result-years">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-3"
                        >
                          {resultYears.map((yearItem, index) => (
                            <Draggable key={yearItem.year} draggableId={yearItem.year} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="bg-white p-3 rounded border border-gray-200 flex flex-col sm:flex-row gap-4 items-center relative group"
                                >
                                  <div {...provided.dragHandleProps} className="text-gray-400 cursor-move">
                                    <div className="flex flex-col gap-1">
                                      <ArrowUp 
                                        className="h-4 w-4 hover:text-primary-blue cursor-pointer" 
                                        onClick={(e) => { e.stopPropagation(); handleMoveYearUp(index); }}
                                      />
                                      <ArrowDown 
                                        className="h-4 w-4 hover:text-primary-blue cursor-pointer" 
                                        onClick={(e) => { e.stopPropagation(); handleMoveYearDown(index); }}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="font-semibold text-xl">{yearItem.year}</div>
                                  
                                  <div className="flex-1">
                                    {yearItem.imageUrl ? (
                                      <div className="relative group cursor-pointer w-full max-w-[200px] mx-auto">
                                        <img 
                                          src={yearItem.imageUrl} 
                                          alt={`Results ${yearItem.year}`} 
                                          className="h-32 w-full object-cover rounded border border-gray-200"
                                        />
                                        <div 
                                          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                                          onClick={() => fileInputRef.current?.click()}
                                        >
                                          <label 
                                            htmlFor="year-image-input" 
                                            className="cursor-pointer text-white bg-primary-blue rounded-full p-2"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              if (fileInputRef.current) {
                                                fileInputRef.current.onchange = (event) => 
                                                  handleYearImageChange(event as React.ChangeEvent<HTMLInputElement>, yearItem.year);
                                                fileInputRef.current.click();
                                              }
                                            }}
                                          >
                                            <Upload className="h-5 w-5" />
                                          </label>
                                        </div>
                                      </div>
                                    ) : (
                                      <div 
                                        className="h-32 w-full max-w-[200px] mx-auto border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-primary-blue hover:border-primary-blue cursor-pointer transition-colors"
                                        onClick={() => {
                                          if (fileInputRef.current) {
                                            fileInputRef.current.onchange = (event) => 
                                              handleYearImageChange(event as React.ChangeEvent<HTMLInputElement>, yearItem.year);
                                            fileInputRef.current.click();
                                          }
                                        }}
                                      >
                                        <ImageIcon className="h-8 w-8" />
                                        <span className="text-xs text-center">Click to upload<br/>result image</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveResultYear(index)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                ) : (
                  <div className="bg-white p-4 border border-dashed border-gray-300 rounded text-center text-gray-500">
                    No result years added yet. Add years and images to showcase your program results.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Program Video Testimonials</h3>
                <VideoTestimonialForm 
                  onSuccess={() => {
                    // Refresh testimonials data
                    queryClient.invalidateQueries({ queryKey: ["testimonials", "video"] });
                    // Also refresh program-specific testimonials
                    if (program?.id) {
                      queryClient.invalidateQueries({ queryKey: [`admin/programs/${program.id}/testimonials`] });
                      queryClient.invalidateQueries({ queryKey: [`admin/programs/${program.id}/testimonials`, 'video'] });
                      queryClient.invalidateQueries({ queryKey: [`admin/programs/${program.slug}/testimonials`] });
                      queryClient.invalidateQueries({ queryKey: [`admin/programs/${program.slug}/testimonials`, 'video'] });
                    }
                  }} 
                  programName={form.getValues("title")}
                  programId={program?.id}
                />
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Add program-specific video testimonials for this program (similar to Student Testimonials on homepage)
              </p>

              {/* Display program-specific testimonials here */}
              <div className="bg-white p-3 border border-blue-100 rounded-md">
                <p className="text-sm text-gray-500">
                  Use the "Add New Video Testimonial" button to create new testimonials specifically for this program. 
                  Added testimonials will automatically be associated with this program.
                </p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Program Student Testimonials</h3>
                <ImageTestimonialForm 
                  onSuccess={() => {
                    // Refresh testimonials data
                    queryClient.invalidateQueries({ queryKey: ["testimonials", "image"] });
                    // Also refresh program-specific testimonials
                    if (program?.id) {
                      queryClient.invalidateQueries({ queryKey: [`admin/programs/${program.id}/testimonials`] });
                      queryClient.invalidateQueries({ queryKey: [`admin/programs/${program.id}/testimonials`, 'student'] });
                      queryClient.invalidateQueries({ queryKey: [`admin/programs/${program.slug}/testimonials`] });
                      queryClient.invalidateQueries({ queryKey: [`admin/programs/${program.slug}/testimonials`, 'student'] });
                    }
                  }} 
                  programName={form.getValues("title")}
                  programId={program?.id}
                />
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Add program-specific student testimonials with images for this program (similar to Success Stories on homepage)
              </p>

              {/* Display program-specific testimonials here */}
              <div className="bg-white p-3 border border-blue-100 rounded-md">
                <p className="text-sm text-gray-500">
                  Use the "Add New Student Testimonial" button to create new student testimonials specifically for this program. 
                  Added testimonials will automatically be associated with this program.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => onSuccess()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Program
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
