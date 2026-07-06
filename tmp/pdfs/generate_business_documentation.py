from datetime import datetime
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def build_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="TitleMain",
            parent=styles["Title"],
            fontSize=24,
            leading=30,
            textColor=colors.HexColor("#102A43"),
            spaceAfter=12,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Subtitle",
            parent=styles["Normal"],
            fontSize=11,
            leading=15,
            textColor=colors.HexColor("#334E68"),
            spaceAfter=16,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionHeader",
            parent=styles["Heading2"],
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#0B4F6C"),
            spaceBefore=8,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodyTextCustom",
            parent=styles["BodyText"],
            fontSize=10.5,
            leading=15.5,
            textColor=colors.HexColor("#1F2933"),
            spaceAfter=7,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BulletCustom",
            parent=styles["BodyText"],
            fontSize=10.2,
            leading=14.8,
            leftIndent=14,
            firstLineIndent=-8,
            spaceAfter=5,
            textColor=colors.HexColor("#1F2933"),
        )
    )
    return styles


def add_cover(story, styles):
    today = datetime.now().strftime("%B %d, %Y")
    story.append(Paragraph("GovFlow AI", styles["TitleMain"]))
    story.append(Paragraph("Professional Business Documentation Pack", styles["TitleMain"]))
    story.append(
        Paragraph(
            "Prepared for founder and investor conversations, strategic partnerships, and operational alignment.",
            styles["Subtitle"],
        )
    )
    story.append(Paragraph(f"Prepared on: {today}", styles["BodyTextCustom"]))
    story.append(Spacer(1, 0.6 * cm))

    summary_data = [
        ["Document Scope", "Company overview, business model, operations, GTM, financial plan, governance"],
        ["Startup Focus", "AI-first government service navigation and delegated agent workflow for Ghana users"],
        ["Primary Product", "GovFlow platform with roadmap guidance, document intelligence, and GovFlow Agent"],
        ["Business Stage", "Early growth with production platform, admin operations console, and payment workflow"],
    ]
    table = Table(summary_data, colWidths=[4.2 * cm, 11.8 * cm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#0B4F6C")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#D9E2EC")),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9.8),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(table)
    story.append(Spacer(1, 0.8 * cm))


def add_section(story, styles, title, paragraphs=None, bullets=None):
    story.append(Paragraph(title, styles["SectionHeader"]))
    if paragraphs:
        for text in paragraphs:
            story.append(Paragraph(text, styles["BodyTextCustom"]))
    if bullets:
        for item in bullets:
            story.append(Paragraph(f"- {item}", styles["BulletCustom"]))


def add_kpi_table(story):
    kpi_data = [
        ["KPI Category", "Metric", "Target / Direction"],
        ["Growth", "Monthly active users", "Sustain positive month-on-month growth"],
        ["Operations", "Agent case completion rate", "Increase completed vs pending backlog"],
        ["Trust", "On-time updates to users", "High consistency across app + WhatsApp + SMS"],
        ["Commercial", "Paid Agent conversion", "Improve intake to paid conversion post review"],
        ["Quality", "Reported issue resolution", "Resolve open reports quickly and visibly"],
    ]
    table = Table(kpi_data, colWidths=[3.2 * cm, 6.0 * cm, 6.8 * cm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0B4F6C")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#F8FAFC")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#BCCCDC")),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9.5),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.append(table)
    story.append(Spacer(1, 0.35 * cm))


def build_document(output_pdf: Path):
    styles = build_styles()
    doc = SimpleDocTemplate(
        str(output_pdf),
        pagesize=A4,
        leftMargin=1.7 * cm,
        rightMargin=1.7 * cm,
        topMargin=1.7 * cm,
        bottomMargin=1.7 * cm,
        title="GovFlow AI Business Documentation Pack",
        author="GovFlow AI",
    )
    story = []

    add_cover(story, styles)

    add_section(
        story,
        styles,
        "1. Executive Summary",
        paragraphs=[
            "GovFlow AI is a digital government copilot for individuals and SMEs in Ghana. The platform combines guided workflows, AI assistant support, and delegated service execution through GovFlow Agent.",
            "The company is positioned to reduce friction in government service access by improving clarity, reducing repeat visits, and introducing an operations layer that users can trust before payment.",
        ],
        bullets=[
            "Core value proposition: fewer mistakes, clearer next steps, and faster execution in public service workflows.",
            "Differentiator: integrated product + operations model with app, WhatsApp, SMS, and admin controls.",
            "Commercial path: freemium guidance with premium delegated processing and partner-led expansion.",
        ],
    )

    add_section(
        story,
        styles,
        "2. Problem Statement and Market Opportunity",
        paragraphs=[
            "Government service journeys remain fragmented, opaque, and highly manual for many users. Applicants often face avoidable delays due to missing documents, wrong sequencing, unclear fees, and poor communication.",
            "SMEs face additional complexity as they navigate registration, tax, permits, and cross-border opportunities under AfCFTA. The demand for trustworthy digital orchestration is large and still underserved.",
        ],
        bullets=[
            "Pain points: confusing requirements, high rejection risk, and repeated office visits.",
            "Market tailwind: digitization efforts across agencies and increasing smartphone access.",
            "Expansion vector: AfCFTA-aligned support for customs docs, duties, and verified counterpart discovery.",
        ],
    )

    add_section(
        story,
        styles,
        "3. Product and Service Portfolio",
        bullets=[
            "Roadmap and checklist engine for major services (business startup, passport, national service, Ghana Card).",
            "Document ingestion and AI context memory for better task continuity.",
            "GovFlow Agent delegated execution with status milestones and in-person alerts.",
            "Admin console (Tumiwura) for requests, users, SMS operations, fee setting, and insights.",
            "Coming soon modules including AfCFTA Trade Support.",
        ],
    )

    add_section(
        story,
        styles,
        "4. Business Model and Revenue Strategy",
        bullets=[
            "Primary revenue: service fees from delegated GovFlow Agent requests.",
            "Secondary revenue: premium workflow support, SME packages, and partner referrals.",
            "Future revenue lanes: embedded financing and enterprise analytics for institutional partners.",
            "Pricing governance: admin-defined fee controls per service with ability to apply to open cases.",
        ],
    )

    add_section(
        story,
        styles,
        "5. Go-To-Market Strategy",
        bullets=[
            "Channel mix: social acquisition, community referrals, and WhatsApp-led conversion funnels.",
            "Trust-first sales motion: intake first, admin review, scope alignment, then secure payment.",
            "Retention strategy: lifecycle reminders, transparent tracking, and post-service re-engagement.",
            "Partnership strategy: collaborate with legal, compliance, and trade-support ecosystem actors.",
        ],
    )

    add_section(
        story,
        styles,
        "6. Operations and Governance",
        bullets=[
            "Centralized admin operations with auditable status transitions and communication history.",
            "Case progression controls: review, approve, decline, start processing, complete, and alert.",
            "User account governance: view account stats, ban or unban, and delete when required.",
            "Incident handling: reported-problem workflows with investigate and resolve states.",
        ],
    )

    add_section(
        story,
        styles,
        "7. Technology, Security, and Compliance Position",
        bullets=[
            "Platform built on Next.js and Supabase with authenticated admin sessions and role protections.",
            "Payment flow integrated with secure gateway and post-payment document handling.",
            "Multi-channel communication with primary and backup SMS providers for reliability.",
            "Data minimization principles and clear user-facing legal disclaimers for risk management.",
        ],
    )

    add_section(
        story,
        styles,
        "8. Financial Planning Framework (12-18 Months)",
        paragraphs=[
            "The financial objective is to scale paid case throughput while controlling operational cost per completed request. Unit economics should be tracked by service type and case complexity.",
        ],
        bullets=[
            "Top-line driver: paid case volume x average service fee.",
            "Cost drivers: coordination labor, field support, messaging, and payment processing.",
            "Efficiency focus: reduce rework and cycle time through better intake quality and QA controls.",
            "Cash discipline: prioritize high-trust conversion channels and measurable acquisition spend.",
        ],
    )

    add_section(
        story,
        styles,
        "9. Risks and Mitigation",
        bullets=[
            "Regulatory changes: maintain policy watch process and rapid update playbooks.",
            "Service delivery variance: enforce SOPs with step-level accountability and timestamped events.",
            "Trust and reputation risk: preserve transparency in fees, timelines, and responsibility boundaries.",
            "Platform concentration risk: maintain provider fallback layers and incident response routines.",
        ],
    )

    add_section(
        story,
        styles,
        "10. KPI Dashboard Framework",
        paragraphs=[
            "Management should review operational and commercial KPIs weekly, with monthly deep dives on conversion, completion speed, and customer trust signals.",
        ],
    )
    add_kpi_table(story)

    add_section(
        story,
        styles,
        "11. 12-Month Strategic Milestones",
        bullets=[
            "Expand Agent support from passport to additional high-demand public services.",
            "Deepen user account operations and automated risk flags in admin tooling.",
            "Launch AfCFTA Trade Support pilot for SME customs and cross-border readiness.",
            "Establish partner channels with documented service quality SLAs.",
        ],
    )

    add_section(
        story,
        styles,
        "12. Use of This Document",
        paragraphs=[
            "This pack is suitable for investor intros, strategic partner meetings, internal alignment, and grant or accelerator applications. It should be reviewed quarterly and updated as operating data improves.",
        ],
    )

    doc.build(story)


def main():
    repo_root = Path(__file__).resolve().parents[2]
    output_pdf = repo_root / "output" / "pdf" / "govflow-ai-business-documentation.pdf"
    output_pdf.parent.mkdir(parents=True, exist_ok=True)
    build_document(output_pdf)

    desktop_pdf = Path.home() / "Desktop" / "GovFlow-AI-Business-Documentation.pdf"
    desktop_pdf.write_bytes(output_pdf.read_bytes())

    print(f"Generated: {output_pdf}")
    print(f"Copied to Desktop: {desktop_pdf}")


if __name__ == "__main__":
    main()
