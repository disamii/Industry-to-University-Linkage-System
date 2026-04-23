from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from organizational_structure.models import OrganizationalUnit

User = get_user_model()


class Command(BaseCommand):
    help = "Populate missing organizational structure for BDU including BIT and CS updates"

    def handle(self, *args, **options):
        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            self.stdout.write(self.style.ERROR("No superuser found. Please create one."))
            return

        def create_unit(name, unit_type, parent=None, abbreviation=None):
            try:
                obj, created = OrganizationalUnit.objects.get_or_create(
                    name=name,
                    parent=parent,
                    defaults={
                        "unit_type": unit_type,
                        "abbreviation": abbreviation,
                        "created_by": admin_user,
                        "updated_by": admin_user
                    }
                )
                self.stdout.write(self.style.SUCCESS(f"Created: {name} ({abbreviation})"))
                return obj
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to create {name} ({abbreviation}): {e}"))
                return None


        # BDU already exists
        bdu = OrganizationalUnit.objects.get(abbreviation="BDU")

        # ================== Existing Units ==================
        bit = OrganizationalUnit.objects.get(abbreviation="BIT")
        cos = OrganizationalUnit.objects.get(abbreviation="COS")

        # ================== Colleges/Institutes ==================
        cmhs = create_unit("College of Medicine and Health Sciences", "college", bdu, abbreviation="CMHS")
        caes = create_unit("College of Agriculture and Environmental Sciences", "college", bdu, abbreviation="CAES")
        cebs = create_unit("College of Education and Behavioral Sciences", "college", bdu, abbreviation="CEBS")
        cbe = create_unit("College of Business and Economics", "college", bdu, abbreviation="CBE")
        eitex = create_unit("Ethiopia Institute of Textile and Fashion Technology", "institute", bdu, abbreviation="EiTEX")
        ila = create_unit("Institute of Land Administration", "institute", bdu, abbreviation="ILA")
        idrmfss = create_unit("Institute of Disaster Risk Management and Food Security Studies", "institute", bdu, abbreviation="IDRMFSS")

        # ================== CMHS ==================
        med_ed = create_unit("Medical Education and Services", "school", cmhs)
        for dept in ["Department of Anesthesia", "Department of Physiotherapy", "Doctor of Medicine (M.D.)"]:
            create_unit(dept, "department", med_ed)

        specialty = create_unit("Specialty Departments", "school", cmhs)
        for dept in [
            "Department of General Surgery",
            "Department of Gynaecology and Obstetrics",
            "Department of Orthopaedics and Trauma Surgery",
            "Department of Paediatric and Child Health",
            "Department of Internal Medicine",
            "Department of Clinical Radiology and Imaging",
            "Department of Dermatology and Venereology",
            "Department of Ear, Nose and Throat (ENT)",
            "Department of Ophthalmology",
            "Department of Anaesthesiology and Critical Care",
            "Department of Psychiatry",
            "Department of Emergency and Critical Care Medicine"
        ]:
            create_unit(dept, "department", specialty)

        public_health = create_unit("Public Health Education and Services", "school", cmhs)
        for dept in [
            "Department of Environmental Health",
            "Department of Epidemiology and Biostatistics",
            "Department of Health Promotion and Behavioral Science",
            "Department of Health Systems Management and Health Economics",
            "Department of Nutrition and Dietetics",
            "Department of Reproductive Health and Population Studies"
        ]:
            create_unit(dept, "department", public_health)

        lab_ed = create_unit("Medical Laboratory Education and Services", "school", cmhs)
        create_unit("Department of Medical Laboratory Science", "department", lab_ed)

        pharmacy = create_unit("Pharmacy Education and Services", "school", cmhs)
        create_unit("Department of Pharmacy", "department", pharmacy)

        nursing = create_unit("Nursing and Midwifery Education and Services", "school", cmhs)
        for dept in [
            "Department of Adult Health Nursing",
            "Department of Emergency and Critical Care Nursing",
            "Department of Pediatrics and Child Health Nursing",
            "Department of Midwifery"
        ]:
            create_unit(dept, "department", nursing)

        create_unit("Tana Research and Diagnostic Center (TRDC)", "research_center", cmhs)

        # ================== CAES ==================
        for dept in [
            "School of Fisheries and Wildlife",
            "Department of Agricultural Economics",
            "Department of Animal Science",
            "Department of Horticulture",
            "Department of Natural Resource Management",
            "Department of Plant Science",
            "Department of Rural Development"
        ]:
            create_unit(dept, "department", caes)
        create_unit("Biotechnology Research Institute", "research_center", caes)

        # ================== CEBS ==================
        school_ed = create_unit("School of Educational Sciences", "school", cebs)
        for dept in [
            "Department of Curriculum Studies",
            "Department of Educational Planning & Management",
            "Department of Lifelong & Community Development",
            "Department of Psychology",
            "Department of Special Needs & Inclusive Education"
        ]:
            create_unit(dept, "department", school_ed)

        school_teacher = create_unit("School of Teacher Education", "school", cebs)
        for dept in [
            "Department of Career & Technical Education",
            "Department of Language Education",
            "Department of Mathematics & Science Education",
            "Department of Social Studies Education"
        ]:
            create_unit(dept, "department", school_teacher)

        create_unit("Center for the Study of Science and Mathematics Teaching and Learning", "research_center", cebs)
        create_unit("Institute of Pedagogical and Educational Research (IPER)", "research_center", cebs)

        # ================== CBE ==================
        for dept in [
            "Accounting and Finance Program",
            "Management",
            "Economics",
            "Marketing Management",
            "Logistics and Supply Chain Management",
            "Tourism Management",
            "Hotel Management"
        ]:
            create_unit(dept, "department", cbe)
        create_unit("Institute of Economics Research", "research_center", cbe)

        # ================== ILA ==================
        for dept in [
            "Department of Land Administration and Surveying",
            "Department of Real Property Valuation",
            "Department of Architecture"
        ]:
            create_unit(dept, "department", ila)

        # ================== IDRMFSS ==================
        for dept in [
            "Department of Disaster Risk Management and Sustainable Development",
            "Department of Occupational Safety, Risk Management and Environment"
        ]:
            create_unit(dept, "department", idrmfss)

        # ================== EiTEX ==================
        faculty_textile = create_unit("Faculty of Textile", "faculty", eitex)
        for dept in [
            "Department of Textile Engineering",
            "Department of Textile Design",
            "Department of Textile Chemical Process Engineering",
            "Department of Textile and Apparel Merchandising"
        ]:
            create_unit(dept, "department", faculty_textile)

        faculty_apparel = create_unit("Faculty of Apparel", "faculty", eitex)
        for dept in [
            "Department of Leather Engineering",
            "Department of Fashion Design",
            "Department of Fashion Engineering"
        ]:
            create_unit(dept, "department", faculty_apparel)

        # EiTEX Research centers
        for rc in [
            "Textile Science & Engineering Research Center",
            "Biorefinery Research Centre (BRRC)",
            "Indigenous Textile Research Center"
        ]:
            create_unit(rc, "research_center", eitex)

        # ================== BIT Research Centers ==================
        for rc in [
            "Business Incubation and Techno-Enterprise",
            "ICT4D Research Center",
            "Bahir Dar Energy Center"
        ]:
            create_unit(rc, "research_center", bit)

        # ================== CS Departments (College of Science) ==================
        for dept in ["Department of Biology", "Department of Chemistry", "Department of Physics", "Department of Statistics", "Department of Industrial Chemistry"]:
            create_unit(dept, "department", cos)

        # ================== Schools (direct children of BDU) ==================
        ses = create_unit("School of Earth Sciences", "school", bdu)
        create_unit("Department of Geology", "department", ses)

        sol = create_unit("School of Law", "school", bdu)
        create_unit("Department of Governance and Development Studies", "department", sol)
        create_unit("Department of Law", "department", sol)

        # ================== Faculties (direct children of BDU) ==================
        fh = create_unit("Faculty of Humanities", "faculty", bdu)
        for dept in [
            "Department of English Language and Literature",
            "Department of Ethiopian Language(s) & Literature – Amharic",
            "Department of Folklore",
            "Department of Ethiopian Language(s) and Literature – Ge’ez",
            "Department of Cinema and Theatre Arts",
            "Department of French Language",
            "Department of Journalism & Communication"
        ]:
            create_unit(dept, "department", fh)

        fss = create_unit("Faculty of Social Sciences", "faculty", bdu)
        for dept in [
            "Department of Social Anthropology",
            "Department of Political Science and International Relations",
            "Department of Gender and Development",
            "Department of Geography and Environmental Studies",
            "Department of History and Heritage Management",
            "Department of Social Work"
        ]:
            create_unit(dept, "department", fss)
        create_unit("Abay Culture and Development Research Center", "research_center", fss)

        self.stdout.write(self.style.SUCCESS("✅ Organizational structure populated successfully."))
