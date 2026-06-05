import Papa from 'papaparse';

export const exportContestantsAsCSV = (school: any, contestants: any[]) => {
  if (!contestants || contestants.length === 0) return;
  
  // Use UTF-8 encoding
  const csvData = contestants.map(c => ({
    'Contestant Name': c.name,
    'ID': c.contestant_id,
    'Category': c.categories?.name + (c.categories?.age_group ? ` - ${c.categories?.age_group}` : ''),
    'NIC': c.nic || '',
    'Mobile': c.mobile || ''
  }));

  // Generate CSV string with UTF-8 BOM for Excel compatibility
  const csvString = '\uFEFF' + Papa.unparse(csvData);
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  
  const schoolNameStr = school?.school_name ? school.school_name.replace(/\s+/g, '_').toLowerCase() : 'school_name';
  const schoolIdStr = school?.school_id ? school.school_id.toLowerCase() : 'school_id';
  const dateStr = new Date().toISOString().split('T')[0];
  
  a.download = `${schoolNameStr}_${schoolIdStr}_sambhashaxxvi_contestant_list_[${dateStr}].csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
