import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportContestantsAsPDF = async (school: any, contestants: any[]) => {
  if (!contestants || contestants.length === 0) return;

  // A3 dimensions = format: 'a3' landscape
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a3'
  });

  const loadImage = (src: string, makeBlack?: boolean): Promise<string> => {
    return new Promise((resolve) => {
      if (!src) {
        resolve('');
        return;
      }
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          if (makeBlack) {
            ctx.globalCompositeOperation = 'source-in';
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve('');
        }
      };
      img.onerror = () => resolve('');
    });
  };

  const nccuLogoData = await loadImage('/nccu_nccrest.png');

  const pageWidth = doc.internal.pageSize.getWidth();
  const schoolNameTitle = school?.school_name || '';
  const schoolIdTitle = school?.school_id || '';
  const schoolCityTitle = school?.city || '';
  
  doc.setFont("helvetica", "bold");
  
  // Center Title block
  const splitTitle = doc.splitTextToSize(schoolNameTitle.toUpperCase(), pageWidth - 400);
  // Add space for city and ID
  const headerHeight = Math.max(100, 70 + (splitTitle.length * 20));

  const tableData = contestants.map(c => [
    c.name,
    c.contestant_id,
    c.categories?.name + (c.categories?.age_group ? ` - ${c.categories?.age_group}` : ''),
    c.mobile || '-',
    c.nic || '-',
    '' // Signature
  ]);

  autoTable(doc, {
    head: [['CONTESTANT NAME', 'REG. ID', 'CATEGORY', 'CONTACT NO', 'NIC', 'SIGNATURE']],
    body: tableData,
    startY: headerHeight + 50, 
    theme: 'plain',
    styles: { 
      fontSize: 14, // increased font size to printable 
      cellPadding: { top: 16, right: 14, bottom: 16, left: 14 }, 
      font: "helvetica", 
      valign: 'middle', 
      minCellHeight: 50, 
    },
    headStyles: { 
      textColor: [0, 0, 0], 
      fontStyle: 'bold', 
      halign: 'left',
      lineWidth: { bottom: 1 },
      lineColor: [0, 0, 0]
    },
    bodyStyles: { 
      textColor: [30, 30, 30],
      lineWidth: { bottom: 0.5 },
      lineColor: [200, 200, 200]
    },
    columnStyles: {
      0: { cellWidth: 260 },
      1: { cellWidth: 120 },
      2: { cellWidth: 200 },
      3: { cellWidth: 140 },
      4: { cellWidth: 140 },
      5: { cellWidth: 230 } // Give ample space for physical signature
    },
    margin: { top: 50, left: 50, right: 50, bottom: 50 }, 
    didDrawPage: function (data) {
      if (data.pageNumber > 1) return;
      
      const logoSizeY = 72; // increased by 20% from 60
      const combinedNccuLogoWidth = 144; // combined image is probably wider (2:1 aspect ratio roughly)

      // Start drawing from Top Left
      let currentX = 50;

      // 1) NCCU combined logo
      if (nccuLogoData) {
        doc.addImage(nccuLogoData, 'PNG', currentX, 40, combinedNccuLogoWidth, logoSizeY, undefined, 'FAST');
        currentX += combinedNccuLogoWidth + 20;
      }

      // SAMBHASHA XXVI (Top Right)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text("SAMBHASHA XXVI", pageWidth - 50, 60, { align: 'right' });
      
      // THE MEDIA COMPETITION (Below SAMBHASHA XXVI)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text("THE MEDIA COMPETITION", pageWidth - 50, 78, { align: 'right' });
      
      // Center Title (School Name)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text(splitTitle, pageWidth / 2, 55, { align: 'center' });
      
      // School City
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 80, 80);
      doc.text(schoolCityTitle.toUpperCase(), pageWidth / 2, 60 + (splitTitle.length * 20), { align: 'center' });

      // School ID
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text(`REG ID: ${schoolIdTitle}`, pageWidth / 2, 78 + (splitTitle.length * 20), { align: 'center' });
    }
  });

  const schoolNameStr = school?.school_name ? school.school_name.replace(/\s+/g, '_').toLowerCase() : 'school_name';
  const schoolIdStr = school?.school_id ? school.school_id.toLowerCase() : 'school_id';
  const dateStr = new Date().toISOString().split('T')[0];
  
  doc.save(`${schoolNameStr}_${schoolIdStr}_sambhashaxxvi_contestant_list_[${dateStr}].pdf`);
};

export const exportAdminCategoryContestantsAsPDF = async (category: any | null, contestants: any[]) => {
  if (!contestants || contestants.length === 0) return;

  // A3 dimensions = format: 'a3' landscape
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a3'
  });

  const loadImage = (src: string, makeBlack?: boolean): Promise<string> => {
    return new Promise((resolve) => {
      if (!src) {
        resolve('');
        return;
      }
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          if (makeBlack) {
            ctx.globalCompositeOperation = 'source-in';
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve('');
        }
      };
      img.onerror = () => resolve('');
    });
  };

  const nccuLogoData = await loadImage('/nccu_nccrest.png');

  const pageWidth = doc.internal.pageSize.getWidth();
  const categoryNameTitle = category?.name ? (category?.age_group ? `${category.name} - ${category.age_group}` : category.name) : 'ALL CONTESTANTS';
  const categoryIdTitle = category?.id || 'ALL';
  
  doc.setFont("helvetica", "bold");
  
  // Center Title block
  const splitTitle = doc.splitTextToSize(categoryNameTitle.toUpperCase(), pageWidth - 400);
  // Add space for ID
  const headerHeight = Math.max(100, 70 + (splitTitle.length * 20));

  const tableData = contestants.map(c => {
    const row = [
      c.name,
      c.contestant_id,
      c.school_details?.school_name || '-',
      c.mobile || '-',
      c.nic || '-'
    ];
    if (!category) {
      const catName = c.categories?.name ? (c.categories?.age_group ? `${c.categories.name} - ${c.categories.age_group}` : c.categories.name) : '-';
      row.splice(2, 0, catName); // Insert Category before School
    }
    row.push(''); // Signature
    return row;
  });

  const head = category 
    ? [['CONTESTANT NAME', 'REG. ID', 'SCHOOL', 'CONTACT NO', 'NIC', 'SIGNATURE']]
    : [['CONTESTANT NAME', 'REG. ID', 'CATEGORY', 'SCHOOL', 'CONTACT NO', 'NIC', 'SIGNATURE']];

  let columnStyles: any = {
    0: { cellWidth: 260 },
    1: { cellWidth: 120 },
    2: { cellWidth: 200 },
    3: { cellWidth: 140 },
    4: { cellWidth: 140 },
    5: { cellWidth: 230 }
  };

  if (!category) {
    columnStyles = {
      0: { cellWidth: 230 }, // Contestant name
      1: { cellWidth: 100 }, // ID
      2: { cellWidth: 170 }, // Category
      3: { cellWidth: 180 }, // School
      4: { cellWidth: 120 }, // Contact
      5: { cellWidth: 110 }, // NIC
      6: { cellWidth: 180 }  // Signature
    };
  }

  autoTable(doc, {
    head: head,
    body: tableData,
    startY: headerHeight + 50, 
    theme: 'plain',
    styles: { 
      fontSize: 14, // increased font size to printable 
      cellPadding: { top: 16, right: 14, bottom: 16, left: 14 }, 
      font: "helvetica", 
      valign: 'middle', 
      minCellHeight: 50, 
    },
    headStyles: { 
      textColor: [0, 0, 0], 
      fontStyle: 'bold', 
      halign: 'left',
      lineWidth: { bottom: 1 },
      lineColor: [0, 0, 0]
    },
    bodyStyles: { 
      textColor: [30, 30, 30],
      lineWidth: { bottom: 0.5 },
      lineColor: [200, 200, 200]
    },
    columnStyles: columnStyles,
    margin: { top: 50, left: 50, right: 50, bottom: 50 }, 
    didDrawPage: function (data) {
      if (data.pageNumber > 1) return;
      
      const logoSizeY = 72; // increased by 20% from 60
      const combinedNccuLogoWidth = 144; // combined image is probably wider (2:1 aspect ratio roughly)

      // Start drawing from Top Left
      let currentX = 50;

      // 1) NCCU combined logo
      if (nccuLogoData) {
        doc.addImage(nccuLogoData, 'PNG', currentX, 40, combinedNccuLogoWidth, logoSizeY, undefined, 'FAST');
        currentX += combinedNccuLogoWidth + 20;
      }

      // SAMBHASHA XXVI (Top Right)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text("SAMBHASHA XXVI", pageWidth - 50, 60, { align: 'right' });
      
      // THE MEDIA COMPETITION (Below SAMBHASHA XXVI)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text("THE MEDIA COMPETITION", pageWidth - 50, 78, { align: 'right' });
      
      // Center Title (Category Name)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text(splitTitle, pageWidth / 2, 55, { align: 'center' });
      
      // Category ID
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text(`CATEGORY ID: ${categoryIdTitle}`, pageWidth / 2, 78 + (splitTitle.length * 20), { align: 'center' });
    }
  });

  const categoryNameStr = categoryNameTitle.replace(/\s+/g, '_').toLowerCase();
  const dateStr = new Date().toISOString().split('T')[0];
  
  doc.save(`${categoryNameStr}_sambhashaxxvi_contestants_[${dateStr}].pdf`);
};
