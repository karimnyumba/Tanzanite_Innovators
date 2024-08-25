from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from io import BytesIO

def generate_soil_crop_pdf(data):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    title_style = ParagraphStyle(
        name='Title',
        fontSize=24,
        leading=28,
        alignment=1,  # Center alignment
        textColor=colors.HexColor("#2C3E50"),
        spaceAfter=24
    )
    title = Paragraph("Soil and Crop Analysis Report", title_style)
    story.append(title)

    # Soil Data Title
    soil_title_style = ParagraphStyle(
        name='SoilTitle',
        fontSize=18,
        leading=22,
        spaceAfter=12,
        fontName='Helvetica-Bold'
    )
    soil_title = Paragraph("Soil Data", soil_title_style)
    story.append(soil_title)

    # Soil Data Table
    soil_data = [
        ["Parameter", "Value"],
        ["Nitrogen", f"{data['soil_data']['Nitrogen']} ppm"],
        ["Potassium", f"{data['soil_data']['Potassium']} ppm"],
        ["Phosphorus", f"{data['soil_data']['Phosphorus']} ppm"],
        ["pH", data['soil_data']['ph'] if data['soil_data']['ph'] else ""],
        ["Bulk Density", f"{data['soil_data']['bulk_density']} g/cm³" if data['soil_data']['bulk_density'] else ""],
        ["Land Cover", data['soil_data']['landcover']],
        ["Temperature", f"{data['soil_data']['temperature']}°C" if data['soil_data']['temperature'] else ""],
        ["Humidity", f"{data['soil_data']['humidity']}%" if data['soil_data']['humidity'] else ""],
        ["Rainfall", f"{data['soil_data']['rainfall']} mm" if data['soil_data']['rainfall'] else ""],
        ["Moisture", f"{data['soil_data']['moisture']}" if data['soil_data']['moisture'] else ""]
    ]

    soil_table = Table(soil_data, colWidths=[200, 200])
    soil_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#BDC3C7")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor("#2C3E50")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor("#2C3E50")),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8)
    ]))
    story.append(soil_table)
    story.append(Spacer(1, 24))

    # Recommended Crops Title
    crops_title_style = ParagraphStyle(
        name='CropsTitle',
        fontSize=18,
        leading=22,
       
        spaceAfter=12,
        fontName='Helvetica-Bold'
    )
    crops_title = Paragraph("Recommended Crops", crops_title_style)
    story.append(crops_title)

    for crop in data['crops']:
        if crop['confidence'] ==0:
            continue
        crop_name_style = ParagraphStyle(
            name='CropName',
            fontSize=14,
            leading=18,
            spaceAfter=6,
            fontName='Helvetica-Bold'
        )
        crop_info = f"(Yield Potential: {round(crop['confidence'],2)} tonnes/hectare)" if crop['confidence'] > 0 else ""
        crop_name = Paragraph(f"{crop['crop']}", crop_name_style)
        crop_performance = Paragraph(crop_info,ParagraphStyle(
            name='CropPERF',
            fontSize=11,
            leading=18,
            spaceAfter=6,
            fontName='Helvetica-Bold'
        ))
        story.append(crop_name)
        story.append(crop_performance)

        crop_info = [
            ["Category", crop['details']['category']],
            ["Food Type", crop['details']['food_type']],
            ["Planting Season", crop['details']['planting_season']],
            ["Harvesting Season", crop['details']['harvesting_season']],
            ["Description", Paragraph(crop['details']['description'], styles['BodyText'])]
        ]

        crop_table = Table(crop_info, colWidths=[120, 280])
        crop_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#ECF0F1")),
            ('BACKGROUND', (1, 0), (1, -1), colors.white)
        ]))

        story.append(crop_table)
        story.append(Spacer(1, 12))

    # Build the PDF
    doc.build(story)
    buffer.seek(0)

    return buffer



def generate_soil_fertilizer_pdf(data):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    title_style = ParagraphStyle(
        name='Title',
        fontSize=24,
        leading=28,
        alignment=1,  # Center alignment
        textColor=colors.HexColor("#2C3E50"),
        spaceAfter=24
    )
    title = Paragraph("Soil and Fertilizer Analysis Report", title_style)
    story.append(title)


    # Soil Data Table
    soil_data = [
        ["Parameter", "Value"],
        ["Nitrogen", f"{data['soil_data']['Nitrogen']} ppm"],
        ["Potassium", f"{data['soil_data']['Potassium']} ppm"],
        ["Phosphorus", f"{data['soil_data']['Phosphorus']} ppm"],
        ["pH", data['soil_data']['ph'] if "ph" in data['soil_data'].keys() else ""],
        ["Bulk Density", f"{data['soil_data']['bulk_density']} g/cm³" if 'bulk_density' in data['soil_data'].keys()  else ""],
        ["Land Cover", data['soil_data']['landcover']],
        ["Temperature", f"{data['soil_data']['temperature']}°C" if 'temperature' in data['soil_data'].keys() else ""],
        ["Humidity", f"{data['soil_data']['humidity']}%" if 'humidity' in data['soil_data'].keys() else ""],
        ["Rainfall", f"{data['soil_data']['rainfall']} mm" if 'rainfall' in data['soil_data'].keys() else ""],
        ["Moisture", f"{data['soil_data']['moisture']}" if "moisture" in data['soil_data'].keys() else ""]
    ]

    soil_table = Table(soil_data, colWidths=[200, 200])
    soil_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#BDC3C7")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor("#2C3E50")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor("#2C3E50")),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8)
    ]))
    story.append(soil_table)
    story.append(Spacer(1, 24))


    # Recommended Fertilizers Title
    fertilizers_title_style = ParagraphStyle(
        name='FertilizersTitle',
        fontSize=18,
        leading=22,
        spaceAfter=12,
        fontName='Helvetica-Bold'
    )
    fertilizers_title = Paragraph("Recommended Fertilizers", fertilizers_title_style)
    story.append(fertilizers_title)
    print(data)
    for fertilizer in data["fertilizer"]:
        if fertilizer['confidence'] <= 0:
            continue
        fertilizer_name_style = ParagraphStyle(
            name='FertilizerName',
            fontSize=14,
            leading=18,
            spaceAfter=6,
            fontName='Helvetica-Bold'
        )
        fertilizer_name = Paragraph(f"{fertilizer['fertilizer']} (Confidence: {fertilizer['confidence']}%, {fertilizer['confidence_range'].capitalize()} confidence)", fertilizer_name_style)
        story.append(fertilizer_name)

        fertilizer_info = [
            ["Quantity", f"{fertilizer['details']['quantity']} {fertilizer['details']['unit']}"],
            ["How to Use", fertilizer['details']['how_to_use']],
            ["Description", Paragraph(fertilizer['details']['description'], styles['BodyText'])],
            ["Maximum Price", f"TZS {fertilizer['details']['maximum_price']} ({fertilizer['details']['price_range'].capitalize()} price range)"]
        ]

        fertilizer_table = Table(fertilizer_info, colWidths=[120, 280])
        fertilizer_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#ECF0F1")),
            ('BACKGROUND', (1, 0), (1, -1), colors.white)
        ]))

        story.append(fertilizer_table)
        story.append(Spacer(1, 12))

    # Build the PDF
    doc.build(story)
    buffer.seek(0)

    return buffer


# Generate the PDF
# generate_soil_test_pdf("soil_test_report_with_crops.pdf")
