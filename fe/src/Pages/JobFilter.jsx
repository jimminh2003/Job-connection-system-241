import React, { useState, useEffect } from 'react';
import { Badge } from '../Jsx/badge';
import { Button } from '../Jsx/Button';
import { Card } from '../Jsx/card';
import { Checkbox } from '../Jsx/checkbox';
import { Slider } from '../Jsx/Slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Filter, ChevronDown, X } from 'lucide-react';

const SCHEDULE_TYPES = {
  FULLTIME: 'Full-time',
  PARTTIME: 'Part-time',
  INTERNSHIP: 'Internship',
  FREELANCE: 'Freelance',
  CONTRACT: 'Contract'
};

const EXPERIENCE_LEVELS = {
  INTERN: 'Intern',
  FRESHER: 'Fresher',
  JUNIOR: 'Junior',
  SENIOR: 'Senior',
  LEAD: 'Lead',
  MANAGER: 'Manager',
  DIRECTOR: 'Director'
};

const COMMON_SKILLS = [
  'JavaScript', 'React', 'Angular', 'Vue.js', 'Node.js',
  'Python', 'Java', 'C++', 'TypeScript', 'PHP',
  'AWS', 'Docker', 'Kubernetes', 'Git', 'SQL',
];

const FilterDropdown = ({ title, options, selected, onSelect, badge }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between"
        >
          <span>{title} {badge > 0 && `(${badge})`}</span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2">
        <div className="grid gap-2">
          {Object.entries(options).map(([key, label]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={`option-${key}`}
                checked={selected.includes(key)}
                onCheckedChange={() => onSelect(key)}
              />
              <label htmlFor={`option-${key}`} className="text-sm">
                {label}
              </label>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const JobFilter = ({ jobs, onFilterUpdate, currentResults }) => {
  const [filters, setFilters] = useState({
    schedule: [],
    level: [],
    minSalary: 0,
    maxSalary: 100,
    yoe: '',
    skills: []
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [isSkillsDialogOpen, setIsSkillsDialogOpen] = useState(false);

  const handleScheduleChange = (schedule) => {
    setFilters(prev => ({
      ...prev,
      schedule: prev.schedule.includes(schedule)
        ? prev.schedule.filter(s => s !== schedule)
        : [...prev.schedule, schedule]
    }));
  };

  const handleLevelChange = (level) => {
    setFilters(prev => ({
      ...prev,
      level: prev.level.includes(level)
        ? prev.level.filter(l => l !== level)
        : [...prev.level, level]
    }));
  };

  const handleSkillChange = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (!customSkill.trim()) return;
    if (customSkill && !selectedSkills.includes(customSkill)) {
      alert('Kỹ năng này đã tồn tại!');
      setSelectedSkills(prev => [...prev, customSkill]);
      setCustomSkill('');
    }
  };

  const removeSkill = (skill) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  const handleYoeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setFilters(prev => ({ ...prev, yoe: value }));
  };

  const resetFilters = () => {
    setFilters({
      schedule: [],
      level: [],
      minSalary: 0,
      maxSalary: 100,
      yoe: '',
      skills: []
    });
    setSelectedSkills([]);
    setCustomSkill('');
  };

  useEffect(() => {
    const filteredJobs = jobs.filter(job => {
      const matchesSchedule = filters.schedule.length === 0 || 
        filters.schedule.includes(job.schedule);
      
      const matchesLevel = filters.level.length === 0 || 
        filters.level.includes(job.level);
      
      const matchesSalary = (!job.minSalary || job.minSalary >= filters.minSalary) &&
        (!job.maxSalary || job.maxSalary <= filters.maxSalary);
      
      const matchesYoe = !filters.yoe || 
        (job.yoe && parseInt(job.yoe) <= parseInt(filters.yoe));
      
      const matchesSkills = selectedSkills.length === 0 || 
        selectedSkills.every(skill => 
          job.skills?.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );

      return matchesSchedule && matchesLevel && matchesSalary && 
             matchesYoe && matchesSkills;
    });

    onFilterUpdate(filteredJobs);
  }, [filters, selectedSkills, jobs, onFilterUpdate]);

  return (
    <Card className="max-w-[2000px] mx-auto bg-white p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Filters</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {currentResults?.length || 0} results
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetFilters}
            className="text-red-500 hover:text-white hover:bg-red-500 border-red-500 hover:border-red-600 transition-colors"
          >
            Clear all
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        <FilterDropdown
          title="Schedule"
          options={SCHEDULE_TYPES}
          selected={filters.schedule}
          onSelect={handleScheduleChange}
          badge={filters.schedule.length}
        />

        <FilterDropdown
          title="Experience Level"
          options={EXPERIENCE_LEVELS}
          selected={filters.level}
          onSelect={handleLevelChange}
          badge={filters.level.length}
        />


        

        <Dialog open={isSkillsDialogOpen} onOpenChange={setIsSkillsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>Skills {selectedSkills.length > 0 && `(${selectedSkills.length})`}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select Skills</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Add custom skill"
          
                  className="flex-1 p-2 border rounded-md"
                  onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                />
                <Button onClick={addCustomSkill} size="sm">
                  Add
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {COMMON_SKILLS.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-${skill}`}
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={() => handleSkillChange(skill)}
                    />
                    <label
                      htmlFor={`skill-${skill}`}
                      className="text-sm"
                    >
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <div className="space-y-2">
          <h3 className="text-sm font-medium mb-2">Years of Experience</h3>
          <input
            type="text"
            value={filters.yoe}
            onChange={handleYoeChange}
            placeholder="Enter years of experience"
            className="w-full p-2 border rounded-md"
            maxLength="2"
          />
          <p className="text-xs text-gray-500">Enter a number between 0-20</p>
        </div>
        <div>
<h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
    <span className="text-orange-500 text-xl">💰</span>
    <span>Mức lương (Triệu VNĐ)</span>
</h3>
<div>
  <Slider
    min={0} 
    max={200}
    step={5}
    value={[filters.minSalary, filters.maxSalary]}
    onValueChange={([min, max]) =>
      setFilters(prev => ({ ...prev, minSalary: min, maxSalary: max }))
    }
    className="[&_.sliderTrack]:h-3 [&_.sliderTrack]:bg-orange-200 [&_.sliderRange]:h-3 [&_.sliderRange]:bg-blue-500 [&_.sliderThumb]:h-6 [&_.sliderThumb]:w-6 [&_.sliderThumb]:bg-white [&_.sliderThumb]:border-3 [&_.sliderThumb]:border-blue-500 [&_.sliderThumb]:hover:border-blue-600 [&_.sliderThumb]:shadow-xl [&_.sliderTrack]:rounded-full [&_.sliderRange]:rounded-full [&_.sliderThumb]:hover:scale-125 [&_.sliderThumb]:transition-all [&_.sliderThumb]:duration-300"
  />

  <div className="flex justify-between mt-4">
    <div className="text-center">
      <div className="bg-orange-200 rounded-xl px-6 py-3 shadow-md">
        <p className="text-sm text-orange-700 font-semibold">Tối thiểu</p>
          <p className="text-lg font-bold text-orange-500">{filters.minSalary}M</p>
        </div>
      </div>
      
      <div className="text-center">
        <div className="bg-orange-100 rounded-lg px-4 py-2">
          <p className="text-xs text-orange-600 font-medium">Max</p>
          <p className="text-lg font-bold text-orange-500">{filters.maxSalary}M</p>
        </div>
      </div>
    </div>
  </div>
</div>

      </div>
    </Card>
  );
};

export default JobFilter;