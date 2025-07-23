import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SiteSetting = {
  id: number;
  key: string;
  value: string;
  updatedAt: string;
};

export default function SiteSettingsEditor() {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<{[key: string]: boolean}>({});
  const [settingValues, setSettingValues] = useState<{[key: string]: string}>({});

  // Fetch all settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: () => apiRequest<SiteSetting[]>({ url: "/api/settings" }),
  });

  // Update settings when data is loaded
  useEffect(() => {
    if (settings) {
      const values: {[key: string]: string} = {};
      settings.forEach(setting => {
        values[setting.key] = setting.value;
      });
      setSettingValues(values);
    }
  }, [settings]);

  // Mutation for updating a setting
  const updateSettingMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => {
      return apiRequest({
        url: `/api/settings/${key}`,
        method: "PUT",
        data: { value },
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      queryClient.invalidateQueries({ queryKey: [`/api/settings/${variables.key}`] });
      toast({
        title: "Setting updated",
        description: `${variables.key} has been updated successfully.`,
      });
      // Turn off edit mode for this setting
      setEditMode(prev => ({ ...prev, [variables.key]: false }));
    },
    onError: (error) => {
      console.error("Failed to update setting:", error);
      toast({
        title: "Error",
        description: "Failed to update setting. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (key: string) => {
    setEditMode(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleValueChange = (key: string, value: string) => {
    setSettingValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (key: string) => {
    updateSettingMutation.mutate({ key, value: settingValues[key] });
  };

  const groupedSettings = settings ? {
    "Hero": settings.filter((s: SiteSetting) => s.key.startsWith("hero_")),
    "SEO": settings.filter((s: SiteSetting) => s.key.startsWith("seo_")),
    "Contact": settings.filter((s: SiteSetting) => s.key.startsWith("contact_")),
    "Social": settings.filter((s: SiteSetting) => s.key.startsWith("social_")),
    "Other": settings.filter((s: SiteSetting) => !s.key.startsWith("hero_") && !s.key.startsWith("seo_") && !s.key.startsWith("contact_") && !s.key.startsWith("social_")),
  } : {};

  const formatSettingKey = (key: string) => {
    // Convert snake_case to Title Case and remove prefix
    const withoutPrefix = key.replace(/^(hero_|seo_|contact_|social_)/, "");
    return withoutPrefix
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading site settings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>
          Manage website settings including SEO, hero section content, and contact information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="Hero" className="w-full">
          <TabsList className="mb-4">
            {Object.keys(groupedSettings).map(group => (
              <TabsTrigger key={group} value={group}>{group}</TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(groupedSettings).map(([group, groupSettings]) => (
            <TabsContent key={group} value={group} className="space-y-4">
              {groupSettings.map((setting: SiteSetting) => (
                <div key={setting.id} className="flex flex-col space-y-3 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{formatSettingKey(setting.key)}</h3>
                    <Button 
                      variant={editMode[setting.key] ? "destructive" : "outline"} 
                      size="sm"
                      onClick={() => handleEdit(setting.key)}
                    >
                      {editMode[setting.key] ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                  
                  {editMode[setting.key] ? (
                    <div className="space-y-3">
                      {setting.key.includes("image") || setting.key.includes("poster") || setting.key.includes("icon") ? (
                        <div className="space-y-3">
                          <Input 
                            value={settingValues[setting.key] || ""} 
                            onChange={(e) => handleValueChange(setting.key, e.target.value)}
                            placeholder="Enter URL"
                          />
                          <img 
                            src={settingValues[setting.key]} 
                            alt={`Preview of ${setting.key}`}
                            className="h-32 object-contain"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                          />
                        </div>
                      ) : setting.key.includes("url") || setting.key.includes("video") ? (
                        <Input 
                          value={settingValues[setting.key] || ""} 
                          onChange={(e) => handleValueChange(setting.key, e.target.value)}
                          placeholder="Enter URL"
                        />
                      ) : (
                        <Input 
                          value={settingValues[setting.key] || ""} 
                          onChange={(e) => handleValueChange(setting.key, e.target.value)}
                        />
                      )}
                      <Button onClick={() => handleSave(setting.key)} disabled={updateSettingMutation.isPending}>
                        {updateSettingMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {setting.key.includes("image") || setting.key.includes("poster") || setting.key.includes("icon") ? (
                        <div>
                          <p className="text-sm text-gray-600 mb-2 break-all">{setting.value}</p>
                          <img 
                            src={setting.value} 
                            alt={`Preview of ${setting.key}`}
                            className="h-32 object-contain"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                          />
                        </div>
                      ) : setting.key.includes("url") || setting.key.includes("video") ? (
                        <p className="text-sm text-gray-600 break-all">{setting.value}</p>
                      ) : (
                        <p className="text-sm text-gray-600">{setting.value}</p>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-400">Last updated: {new Date(setting.updatedAt).toLocaleString()}</p>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
