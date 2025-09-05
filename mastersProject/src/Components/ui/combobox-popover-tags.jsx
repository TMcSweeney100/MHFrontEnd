import React, { useState } from "react"
import { Button } from "@/Components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/Components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/Components/ui/command"



export function ComboboxPopoverTags({ selectedTags, setSelectedTags }) {

const [open, setOpen] = useState(false)

  const tags = [
    "stressed",
    "anxious",
    "focused",
    "productive",
    "sad",
    "tired",
    "grateful"
  ];

  return (
    <div className="flex items-center space-x-4">
      <p className="text-muted-foreground text-sm">Tags</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start">
            {selectedTags.length > 0 
              ? `${selectedTags.length} selected` 
              : "+ Add tags"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="left" align="start">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {tags.map((tag) => (
                  <CommandItem
                    key={tag}
                    value={tag}
                    onSelect={(value) => {
                      if (!selectedTags.includes(value)) {
                        setSelectedTags([...selectedTags, value]);
                      }
                      setOpen(false);
                    }}
                  >
                    {tag}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
