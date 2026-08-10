import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="interim-canvas-wrapper min-h-screen bg-[#F5F5F5] text-[#666666] relative overflow-x-hidden flex justify-center">
      
      {/* End-to-end horizontal ruler guide line at 72px top offset */}
      <div className="absolute top-[72px] left-0 right-0 h-[1px] bg-[#C0AAAA]/50 pointer-events-none" />

      {/* Main Ruler Column Container (Max-Width: 1018px, Internal Content: 986px) */}
      <div className="w-full max-w-[1018px] px-4 min-h-screen border-x border-[#E5E5E5] flex flex-col pt-[72px] pb-16 relative z-10 mx-auto min-w-0">
        
        {/* Content Container (Max-Width: 986px) */}
        <div className="w-full max-w-[986px] mx-auto flex flex-col">

          {/* ─── 1. HEADER SECTION ───────────────────────────────────── */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 pb-[72px]">
            
            {/* Left: Avatar + Title & Subtitle */}
            <div className="flex items-center gap-6">
              <div className="relative w-[80px] h-[80px] rounded-full overflow-hidden flex-shrink-0 border border-[#CCCCCC] bg-[#FFFFFF] shadow-sm">
                <Image
                  src="/assets/meet_shah.jpg"
                  alt="Meet Shah"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="flex flex-col gap-3">
                <h1 className="m-0 p-0 flex items-center">
                  <span style={{ fontFamily: "'Figma Hand', cursive", fontWeight: 600, fontSize: "28px", letterSpacing: "0.05em", color: "#3D3D3D", lineHeight: 1 }}>
                    I&apos;m Meet Shah !
                  </span>
                </h1>
                <p className="font-['Jost',sans-serif] text-[20px] text-[#B8B8B8] tracking-[0.8px] font-normal leading-normal m-0">
                  Designer. Researcher. Builder
                </p>
              </div>
            </div>

            {/* Right: Action Buttons & Social Icons */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Resume Button */}
              <a
                href="https://drive.google.com/file/d/1IO_rYBeLqo8_8e-GaFzxW2UgQE863ejX/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-[#FFFFFF] border border-[#CCCCCC] rounded-[8px] p-2 hover:bg-[#F0F0F0] hover:border-[#AAAAAA] transition-all cursor-pointer"
              >
                <span className="font-['Jost',sans-serif] text-[12px] font-medium text-[#666666] leading-[20px] whitespace-nowrap">
                  Resume
                </span>
                {/* System Icon: ix_arrow-diagonal-top-right */}
                <svg className="w-4 h-4 text-[#666666] flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.3333 4.6665V9.99985H10L9.99998 6.94263L5.17154 11.7711L4.22876 10.8283L9.05717 5.99985H5.99998V4.66654L11.3333 4.6665Z" fill="currentColor"/>
                </svg>
              </a>

              {/* LinkedIn Button */}
              <a
                href="https://linkedin.com/in/meetshahco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center justify-center bg-[#FFFFFF] border border-[#CCCCCC] rounded-[8px] p-2 hover:bg-[#F0F0F0] hover:border-[#AAAAAA] transition-all cursor-pointer"
              >
                {/* System Icon: mdi_linkedin */}
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.8333 2.5C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H15.8333ZM15.4167 15.4167V11C15.4167 10.2795 15.1304 9.5885 14.621 9.07903C14.1115 8.56955 13.4205 8.28333 12.7 8.28333C11.9917 8.28333 11.1667 8.71667 10.7667 9.36667V8.44167H8.44167V15.4167H10.7667V11.3083C10.7667 10.6667 11.2833 10.1417 11.925 10.1417C12.2344 10.1417 12.5312 10.2646 12.75 10.4834C12.9688 10.7022 13.0917 10.9989 13.0917 11.3083V15.4167H15.4167ZM5.73333 7.13333C6.10464 7.13333 6.46073 6.98583 6.72328 6.72328C6.98583 6.46073 7.13333 6.10464 7.13333 5.73333C7.13333 4.95833 6.50833 4.325 5.73333 4.325C5.35982 4.325 5.0016 4.47338 4.73749 4.73749C4.47338 5.0016 4.325 5.35982 4.325 5.73333C4.325 6.50833 4.95833 7.13333 5.73333 7.13333ZM6.89167 15.4167V8.44167H4.58333V15.4167H6.89167Z" fill="#666666"/>
                </svg>
              </a>

              {/* Email Button */}
              <a
                href="mailto:hey@meetshah.co"
                aria-label="Email"
                className="inline-flex items-center justify-center bg-[#FFFFFF] border border-[#CCCCCC] rounded-[8px] p-2 hover:bg-[#F0F0F0] hover:border-[#AAAAAA] transition-all cursor-pointer"
              >
                {/* System Icon: mingcute_mail-fill */}
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.3333 15.0002C18.3333 15.4422 18.1577 15.8661 17.8451 16.1787C17.5326 16.4912 17.1087 16.6668 16.6666 16.6668H3.33329C2.89127 16.6668 2.46734 16.4912 2.15478 16.1787C1.84222 15.8661 1.66663 15.4422 1.66663 15.0002V6.641L1.96663 6.891L9.19996 12.9177C9.42457 13.1047 9.70764 13.2072 9.99996 13.2072C10.2923 13.2072 10.5753 13.1047 10.8 12.9177L18.0333 6.891L18.3333 6.641V15.0002ZM16.6666 3.3335C17.0262 3.33372 17.376 3.45021 17.6639 3.66558C17.9518 3.88095 18.1624 4.18365 18.2641 4.5285L16.9658 5.61016L9.99996 11.4152L3.03329 5.61016L1.73579 4.5285C1.83754 4.18365 2.04809 3.88095 2.336 3.66558C2.62391 3.45021 2.97374 3.33372 3.33329 3.3335H16.6666Z" fill="#666666"/>
                </svg>
              </a>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/919033230878"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex items-center justify-center bg-[#FFFFFF] border border-[#CCCCCC] rounded-[8px] p-2 hover:bg-[#F0F0F0] hover:border-[#AAAAAA] transition-all cursor-pointer"
              >
                {/* System Icon: ri_whatsapp-fill */}
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.0008 1.6665C14.6033 1.6665 18.3342 5.39734 18.3342 9.99984C18.3342 14.6023 14.6033 18.3332 10.0008 18.3332C8.52812 18.3357 7.08131 17.946 5.80916 17.204L1.67083 18.3332L2.79749 14.1932C2.05496 12.9206 1.66491 11.4732 1.66749 9.99984C1.66749 5.39734 5.39833 1.6665 10.0008 1.6665ZM7.16083 6.08317L6.99416 6.08984C6.8864 6.09726 6.78112 6.12556 6.68416 6.17317C6.59381 6.22443 6.51129 6.28842 6.43916 6.36317C6.33916 6.45734 6.28249 6.539 6.22166 6.61817C5.91343 7.01892 5.74747 7.51093 5.74999 8.0165C5.75166 8.42484 5.85833 8.82234 6.02499 9.194C6.36583 9.94567 6.92666 10.7415 7.66666 11.479C7.84499 11.6565 8.01999 11.8348 8.20833 12.0007C9.12785 12.8102 10.2236 13.394 11.4083 13.7057L11.8817 13.7782C12.0358 13.7865 12.19 13.7748 12.345 13.7673C12.5876 13.7545 12.8246 13.6888 13.0392 13.5748C13.1482 13.5185 13.2547 13.4573 13.3583 13.3915C13.3583 13.3915 13.3936 13.3676 13.4625 13.3165C13.575 13.2332 13.6442 13.174 13.7375 13.0765C13.8075 13.0043 13.8658 12.9204 13.9125 12.8248C13.9775 12.689 14.0425 12.4298 14.0692 12.214C14.0892 12.049 14.0833 11.959 14.0808 11.9032C14.0775 11.814 14.0033 11.7215 13.9225 11.6823L13.4375 11.4648C13.4375 11.4648 12.7125 11.149 12.2692 10.9473C12.2228 10.9271 12.1731 10.9156 12.1225 10.9132C12.0655 10.9072 12.0078 10.9136 11.9535 10.9318C11.8991 10.9501 11.8493 10.9798 11.8075 11.019C11.8033 11.0173 11.7475 11.0648 11.145 11.7948C11.1104 11.8413 11.0628 11.8764 11.0082 11.8957C10.9535 11.915 10.8944 11.9176 10.8383 11.9032C10.784 11.8887 10.7308 11.8703 10.6792 11.8482C10.5758 11.8048 10.54 11.7882 10.4692 11.7582C9.99072 11.5498 9.54786 11.2677 9.15666 10.9223C9.05166 10.8307 8.95416 10.7307 8.85416 10.634C8.52634 10.32 8.24062 9.96483 8.00416 9.57734L7.95499 9.49817C7.92021 9.44467 7.89169 9.38735 7.86999 9.32734C7.83833 9.20484 7.92083 9.1065 7.92083 9.1065C7.92083 9.1065 8.12333 8.88484 8.21749 8.76484C8.30916 8.64817 8.38666 8.53484 8.43666 8.454C8.53499 8.29567 8.56583 8.13317 8.51416 8.00734C8.28083 7.43734 8.03972 6.87039 7.79083 6.3065C7.74166 6.19484 7.59583 6.11484 7.46333 6.099C7.41833 6.09345 7.37333 6.089 7.32833 6.08567C7.21643 6.07925 7.10424 6.08037 6.99249 6.089L7.16083 6.08317Z" fill="#666666"/>
                </svg>
              </a>

            </div>
          </header>

          {/* ─── 2. ABOUT ME SECTION (pb-10) ─────────────────────────── */}
          <section className="flex flex-col pb-10 gap-4">
            <p className="font-['Geologica',sans-serif] text-[10px] font-medium text-[#B8B8B8] tracking-[0.08em] uppercase leading-normal m-0 font-[CRSV_0,SHRP_0]">
              about me
            </p>
            <p className="font-['Jost',sans-serif] text-[12px] font-normal text-[#666666] tracking-[0.48px] leading-[20px] m-0">
              I&apos;m a product designer from{" "}<span style={{ fontFamily: "'Figma Hand', cursive", fontWeight: 700, color: "#3D3D3D" }}>India</span>{" "}with 9 years building across fintech, SaaS, AdTech, and beyond. My engineering background teaches me{" "}<span style={{ fontFamily: "'Figma Hand', cursive", fontWeight: 700, color: "#3D3D3D" }}>how</span>, user-research experience teaches me{" "}<span style={{ fontFamily: "'Figma Hand', cursive", fontWeight: 700, color: "#3D3D3D" }}>why</span>, and together, it helps me create data-driven, delightful yet functional experiences.
            </p>
          </section>

          {/* ─── 3. NOTABLE EXPERIENCES SECTION (pb-10) ─────────────── */}
          <section className="flex flex-col pb-10 gap-4">
            <p className="font-['Geologica',sans-serif] text-[10px] font-medium text-[#B8B8B8] tracking-[0.08em] uppercase leading-normal m-0 font-[CRSV_0,SHRP_0]">
              notable experiences
            </p>
            <p className="font-['Jost',sans-serif] text-[12px] font-normal text-[#666666] tracking-[0.64px] leading-[24px] m-0">
              Designed{" "}
              <span className="inline-flex items-center gap-1.5 align-middle mx-1">
                {/* Brand Icon: kwikPay_icon.svg */}
                <svg className="w-auto h-[16px] flex-shrink-0" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5404 0.694757L10.956 5.59862C10.88 5.74294 10.7518 5.85567 10.5956 5.91652L8.08523 6.89191L5.24867 7.99371L5.12809 8.04088C4.98472 8.09653 4.87933 8.21681 4.84705 8.36161C4.82331 8.46773 4.84182 8.57763 4.89547 8.67055C4.91493 8.70356 4.93867 8.73516 4.96668 8.76299L7.21456 10.9345C7.28007 10.9996 7.23213 11.1076 7.13718 11.1076H0.511271C0.132431 11.1076 -0.114433 10.7279 0.0536243 10.4044L5.33555 0.26979C5.42195 0.104237 5.59903 0 5.7932 0H13.0799C13.454 0 13.7018 0.371197 13.5414 0.694757H13.5409H13.5404Z" fill="#0980FF"/>
                  <path d="M13.9492 7.58629L8.69862 17.7209C8.61459 17.8916 8.43514 17.9996 8.23717 17.9996H1.01072C0.631881 17.9996 0.385018 17.6199 0.553075 17.2964L3.11998 12.4133C3.23771 12.1869 3.4803 12.0435 3.74568 12.0435H8.58326C8.77125 12.0435 8.94026 11.9359 9.01384 11.7275C9.08743 11.5629 9.05087 11.3728 8.92079 11.244L6.26416 8.7395C6.21147 8.68715 6.23093 8.60131 6.30119 8.57395L8.13368 7.84759C9.84985 7.21651 11.6567 6.88965 13.4878 6.88965C13.8623 6.88965 14.1097 7.26179 13.9502 7.5844L13.9487 7.58582L13.9492 7.58629Z" fill="#0980FF"/>
                </svg>
                <em className="italic font-medium text-[#0980FF] not-italic whitespace-nowrap">
                  Kuwait&apos;s first digital wallet
                </em>
              </span>{" "}
              end-to-end and built a cross-country team of 4 from{" "}
              <span style={{ fontFamily: "'Figma Hand', cursive", fontWeight: 700, color: "#3D3D3D" }}>zero.</span> Led user research at{" "}
              <span className="inline-flex items-center gap-1.5 align-middle mx-1">
                {/* Brand Icon: bob_icon.svg */}
                <svg className="w-auto h-[16px] flex-shrink-0" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.4637 17.9897L3 18V17.7736L9.23053 17.5267C10.4134 17.4855 11.5657 17.4238 12.6772 17.0328C14.9512 16.2611 16.7765 14.6971 17.3068 12.7627C17.8778 10.6842 16.5624 8.66743 14.0844 8.49251C16.1851 7.87514 17.9798 6.52722 18.4591 4.79858C19.0811 2.55547 17.9594 1.41334 16.0627 1.00176C19.2137 0.950312 21.6712 2.02042 20.835 5.05582C20.3558 6.78445 18.5202 8.10151 16.4298 8.67772C18.8873 8.86293 20.2232 11.2192 19.5808 13.2771C18.9077 15.4173 17.1946 16.7447 14.9104 17.5164C13.7989 17.8765 12.6568 17.9383 11.4637 17.9897Z" fill="#F15A29"/>
                  <path d="M7.33663 16.803L3.22812 17C3.22812 16.8963 3.21764 16.8652 3.20716 16.7615L13.5833 13.7958L13.5937 13.6299L3.08139 16.1289C3.04994 16.0356 3.03946 16.0045 2.99754 15.9112L14.0339 9.85528L13.9606 9.68937L2.66215 15.4031C2.58878 15.3097 2.59926 15.2994 2.5259 15.2164L15.6585 2.96981L15.5432 2.835L2.02281 14.8016C1.95993 14.7601 1.92849 14.7187 1.85512 14.6772L11.4556 0.833655L11.2879 0.781807L1.28915 14.4179C1.23675 14.3972 1.17386 14.3868 1.12146 14.3661L6.61345 0.97883L6.46672 0.958093L0.282986 14.2417C0.209619 14.2417 0.125771 14.2417 0.0524045 14.252H0L3.98274 0.0040802L11.4347 0.0248208C14.9563 -0.172203 17.7442 0.771439 16.8218 4.01715C16.3292 5.75926 14.4846 7.11769 12.336 7.69839L12.3255 7.73986C14.8724 7.91615 16.3083 9.94861 15.7214 12.0433C15.1763 13.9928 13.2059 15.5171 10.8687 16.2949C9.72628 16.6993 8.55242 16.7615 7.33663 16.803Z" fill="#F15A29"/>
                </svg>
                <em className="italic font-medium text-[#F15A29] not-italic whitespace-nowrap">
                  India&apos;s 3rd largest bank
                </em>
              </span>
              , conducting 50+ interviews and led UX of 12+ banking journeys{" "}
              <span style={{ fontFamily: "'Figma Hand', cursive", fontWeight: 700, color: "#3D3D3D" }}>informed</span>{" "}
              by those insights. Led product design at{" "}
              <span className="inline-flex items-center gap-1.5 align-middle mx-1">
                {/* Brand Icon: joveo_icon.svg */}
                <svg className="w-auto h-[16px] flex-shrink-0" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.2765 3.7688C13.8046 3.7688 14.233 4.19711 14.233 4.72524C14.233 5.25335 13.8046 5.68166 13.2765 5.68166C12.7484 5.68166 12.3201 5.25335 12.3201 4.72524C12.3201 4.19711 12.7484 3.7688 13.2765 3.7688Z" fill="#B7669E"/>
                  <path d="M4.6935 3.76611C5.22163 3.76611 5.64994 4.19442 5.64994 4.72255C5.64994 5.25067 5.22163 5.67898 4.6935 5.67898C4.16539 5.67898 3.73706 5.25067 3.73706 4.72255C3.73706 4.19442 4.16539 3.76611 4.6935 3.76611Z" fill="#6BB5CF"/>
                  <path d="M13.2765 12.3508C13.8046 12.3508 14.233 12.7791 14.233 13.3073C14.233 13.8354 13.8046 14.2637 13.2765 14.2637C12.7484 14.2637 12.3201 13.8354 12.3201 13.3073C12.3201 12.7791 12.7484 12.3508 13.2765 12.3508Z" fill="#5454BF"/>
                  <path d="M4.6935 12.3484C5.22163 12.3484 5.64994 12.7767 5.64994 13.3048C5.64994 13.833 5.22163 14.2613 4.6935 14.2613C4.16539 14.2613 3.73706 13.833 3.73706 13.3048C3.73706 12.7767 4.16539 12.3484 4.6935 12.3484Z" fill="#D09247"/>
                  <path d="M6.86013 9.34438H1.85007C1.6646 9.34438 1.51489 9.19383 1.51489 9.0092C1.51489 8.82457 1.66543 8.67404 1.85007 8.67404H6.86013C7.84735 8.67404 8.64991 7.87146 8.64991 6.88426V1.85007C8.64991 1.6646 8.80046 1.51489 8.98509 1.51489C9.16972 1.51489 9.32026 1.66543 9.32026 1.85007V6.88426C9.32026 8.24073 8.21661 9.34438 6.85931 9.34438H6.86013Z" fill="#6BB5CF"/>
                  <path d="M8.98996 16.4852C8.80449 16.4852 8.65479 16.3347 8.65479 16.15V11.1408C8.65479 9.78431 9.75843 8.68066 11.1157 8.68066H16.1499C16.3354 8.68066 16.4851 8.8312 16.4851 9.01584C16.4851 9.20047 16.3346 9.35101 16.1499 9.35101H11.1157C10.1285 9.35101 9.32597 10.1536 9.32597 11.1408V16.15C9.32597 16.3355 9.17543 16.4852 8.9908 16.4852H8.98996Z" fill="#5454BF"/>
                  <path d="M15.1761 7.63529H11.8202C11.0185 7.63529 10.3665 6.98324 10.3665 6.18149V2.82565C10.3665 2.64018 10.517 2.49048 10.7016 2.49048C10.8863 2.49048 11.0368 2.64102 11.0368 2.82565V6.18067C11.0368 6.61232 11.3878 6.96328 11.8194 6.96328H15.1753C15.3607 6.96328 15.5104 7.11382 15.5104 7.29846C15.5104 7.48309 15.3599 7.63361 15.1753 7.63361L15.1761 7.63529Z" fill="#B7669E"/>
                  <path d="M6.15073 7.63529H2.79489C2.60942 7.63529 2.45972 7.48475 2.45972 7.30011C2.45972 7.11548 2.61026 6.96494 2.79489 6.96494H6.15073C6.58238 6.96494 6.93336 6.61398 6.93336 6.18233V2.82565C6.93336 2.64018 7.08388 2.49048 7.26852 2.49048C7.45315 2.49048 7.60369 2.64102 7.60369 2.82565V6.18067C7.60369 6.9824 6.95164 7.63445 6.14991 7.63445L6.15073 7.63529Z" fill="#6BB5CF"/>
                  <path d="M7.26935 15.5413C7.08388 15.5413 6.93418 15.3908 6.93418 15.2062V11.8511C6.93418 11.4195 6.58321 11.0685 6.15157 11.0685H2.79489C2.60942 11.0685 2.45972 10.918 2.45972 10.7334C2.45972 10.5487 2.61026 10.3982 2.79489 10.3982H6.15073C6.95248 10.3982 7.60453 11.0502 7.60453 11.852V15.207C7.60453 15.3925 7.45399 15.5422 7.26935 15.5422V15.5413Z" fill="#D09247"/>
                  <path d="M10.7016 15.5412C10.5162 15.5412 10.3665 15.3907 10.3665 15.206V11.851C10.3665 11.0493 11.0185 10.3972 11.8202 10.3972H15.1761C15.3616 10.3972 15.5113 10.5478 15.5113 10.7324C15.5113 10.917 15.3607 11.0676 15.1761 11.0676H11.8202C11.3886 11.0676 11.0376 11.4185 11.0376 11.8502V15.2052C11.0376 15.3907 10.8871 15.5404 10.7024 15.5404L10.7016 15.5412Z" fill="#5454BF"/>
                </svg>
                <em className="italic font-medium text-[#B7669E] not-italic whitespace-nowrap">
                  Joveo
                </em>
              </span>{" "}
              from research through launch, designing conversational recruiter flows, championing embedded research{" "}
              <span style={{ fontFamily: "'Figma Hand', cursive", fontWeight: 700, color: "#3D3D3D" }}>practice</span>{" "}
              across the team. Increased productivity by 3x for{" "}
              <span className="inline-flex items-center gap-1.5 align-middle mx-1">
                {/* Brand Icon: hdfc_icon.svg */}
                <svg className="w-auto h-[16px] flex-shrink-0" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0H5.12113L6.49475 1.38001V0H18V5.11916L16.6241 6.49456H18V18H12.8789L11.5029 16.6223V18H0V12.9384L1.37593 11.5031H0V0Z" fill="#231F20"/>
                  <path d="M2.41997 11.7243H10.5695V15.5763H2.41997V11.7243ZM7.37516 2.42135H15.5224V6.27339H7.37516V2.42135Z" fill="white"/>
                  <path d="M2.41997 2.42135H6.22049V10.7889H2.41997V2.42135Z" fill="#EF3E3A"/>
                  <path d="M11.7242 7.21107H15.5754V15.5764H11.7242V7.21107Z" fill="white"/>
                </svg>
                <em className="italic font-medium text-[#EF3E3A] not-italic whitespace-nowrap">
                  HDFC Home&apos;s
                </em>
              </span>{" "}
              loan appraisers, leading a team of 3 designers through the{" "}
              <span style={{ fontFamily: "'Figma Hand', cursive", fontWeight: 700, color: "#3D3D3D" }}>redesign.</span> Led design at{" "}
              <span className="inline-flex items-center gap-1.5 align-middle mx-1">
                {/* Brand Icon: otb_icon.svg */}
                <svg className="w-auto h-[16px] flex-shrink-0" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_105_6781)">
                    <path d="M8.89773 17.8978C13.8118 17.8978 17.7955 13.9141 17.7955 9.00002C17.7955 4.08594 13.8118 0.102295 8.89773 0.102295C3.98365 0.102295 0 4.08594 0 9.00002C0 13.9141 3.98365 17.8978 8.89773 17.8978Z" fill="#1556EF" fillOpacity="0.25"/>
                    <path d="M8.8977 15.0079C12.2155 15.0079 14.9052 12.3183 14.9052 9.00042C14.9052 5.68257 12.2155 2.99292 8.8977 2.99292C5.57985 2.99292 2.8902 5.68257 2.8902 9.00042C2.8902 12.3183 5.57985 15.0079 8.8977 15.0079Z" fill="#1556EF" fillOpacity="0.5"/>
                    <path d="M8.89773 11.966C10.5358 11.966 11.8636 10.6381 11.8636 9.00009C11.8636 7.36206 10.5358 6.03418 8.89773 6.03418C7.25971 6.03418 5.93182 7.36206 5.93182 9.00009C5.93182 10.6381 7.25971 11.966 8.89773 11.966Z" fill="#1556EF"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_105_6781">
                      <rect width="17.7955" height="18" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <em className="italic font-medium text-[#1556EF] not-italic whitespace-nowrap">
                  Out of the Blue
                </em>
              </span>{" "}
              solving fragmentation across two independent products through{" "}
              <span style={{ fontFamily: "'Figma Hand', cursive", fontWeight: 700, color: "#3D3D3D" }}>systems-thinking,</span> designing unified information architecture and taxonomy.
            </p>
          </section>

          {/* ─── 4. WORK SECTION (pb-10) ─────────────────────────────── */}
          <section className="flex flex-col pb-10">
            <p className="font-['Geologica',sans-serif] text-[10px] font-medium text-[#B8B8B8] tracking-[0.08em] uppercase leading-normal mb-4 font-[CRSV_0,SHRP_0]">
              Work
            </p>
            
            {/* Case Study Card */}
            <a
              href="https://meetshahco.medium.com/designing-the-insight-system-used-across-two-products-helping-a-customer-recover-19k-month-e26d20eb7fcb"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block bg-[#FFFFFF] border border-[#CCCCCC] rounded-[8px] overflow-hidden h-[220px] hover:border-[#999999] transition-all"
            >
              <div className="flex items-stretch h-full">
                
                {/* Left: Project Image Thumbnail */}
                <div className="w-[420px] flex-shrink-0 bg-[#F5F5F5] p-4 overflow-hidden flex items-center justify-center">
                  <Image
                    src="/assets/icons/portfolio_thumbnail.png"
                    alt="Designing the Representation System case study thumbnail"
                    width={420}
                    height={188}
                    className="w-full h-full object-cover rounded-[4px] shadow-sm"
                    priority
                  />
                </div>

                {/* Right: Title, Chips & Arrow */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <p className="font-['Jost',sans-serif] text-[22px] font-medium text-[#3D3D3D] leading-[30px] tracking-[0.88px] m-0 group-hover:text-[#111111] transition-colors">
                    Designing the Representation System Used Across Two Products, Helping a Customer Recover $19K/Month
                  </p>

                  <div className="flex items-center">
                    {/* Chips */}
                    <div className="flex gap-2">
                      {["System Design", "B2B SaaS", "eCommerce-Tech"].map((chip) => (
                        <div key={chip} className="bg-[#F5F5F5] rounded-[4px] px-2.5 py-1.5">
                          <span className="font-['Jost',sans-serif] text-[10px] font-normal text-[#8F8F8F] tracking-[0.4px] whitespace-nowrap">
                            {chip}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Arrow icon — absolutely pinned to card bottom-right */}
                  <svg className="absolute bottom-4 right-4 w-5 h-5 text-[#8F8F8F] group-hover:text-[#3D3D3D] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.3333 4.6665V9.99985H10L9.99998 6.94263L5.17154 11.7711L4.22876 10.8283L9.05717 5.99985H5.99998V4.66654L11.3333 4.6665Z" fill="currentColor"/>
                  </svg>
                </div>

              </div>
            </a>

          </section>

          {/* ─── 5. AI AND PRODUCTS SECTION (pb-10) ──────────────────── */}
          <section className="flex flex-col pb-10">
            <p className="font-['Geologica',sans-serif] text-[10px] font-medium text-[#B8B8B8] tracking-[0.08em] uppercase leading-normal mb-4 font-[CRSV_0,SHRP_0]">
              AI and Products
            </p>

            <div className="flex gap-4">
              
              {/* Product 1: Simple CMS */}
              <a
                href="https://simplecms.meetshah.co"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-1 items-center gap-2 p-3 bg-[#FFFFFF] border border-[#CCCCCC] rounded-[8px] h-[48px] box-border hover:border-[#999999] transition-all"
              >
                {/* System Icon: mdi_github */}
                <svg className="w-6 h-6 text-[#666666] flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21V19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26V21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2Z" fill="#666666"/>
                </svg>
                <p className="font-['Jost',sans-serif] text-[12px] font-normal text-[#666666] tracking-[0.32px] leading-[20px] m-0 whitespace-nowrap">
                  <strong className="font-medium text-[#3D3D3D]">Simple CMS:</strong> An open-source CMS built for designers, PM and more
                </p>
                {/* System Icon: ix_arrow-diagonal-top-right */}
                <svg className="w-4 h-4 text-[#666666] group-hover:text-[#3D3D3D] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 ml-auto" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.3333 4.6665V9.99985H10L9.99998 6.94263L5.17154 11.7711L4.22876 10.8283L9.05717 5.99985H5.99998V4.66654L11.3333 4.6665Z" fill="currentColor"/>
                </svg>
              </a>

              {/* Product 2: FORA */}
              <a
                href="https://github.com/meetshahco/FORA"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-1 items-center gap-[9px] p-3 bg-[#FFFFFF] border border-[#CCCCCC] rounded-[8px] h-[48px] box-border hover:border-[#999999] transition-all"
              >
                {/* System Icon: mdi_github */}
                <svg className="w-6 h-6 text-[#666666] flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21V19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26V21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2Z" fill="#666666"/>
                </svg>
                <p className="font-['Jost',sans-serif] text-[12px] font-normal text-[#666666] tracking-[0.32px] leading-[20px] m-0 whitespace-nowrap">
                  <strong className="font-medium text-[#3D3D3D]">FORA:</strong> An agentic workflow which helps designers apply with intent
                </p>
                {/* System Icon: ix_arrow-diagonal-top-right */}
                <svg className="w-4 h-4 text-[#666666] group-hover:text-[#3D3D3D] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 ml-auto" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.3333 4.6665V9.99985H10L9.99998 6.94263L5.17154 11.7711L4.22876 10.8283L9.05717 5.99985H5.99998V4.66654L11.3333 4.6665Z" fill="currentColor"/>
                </svg>
              </a>

            </div>
          </section>

          {/* ─── 6. COMING SOON CALLOUT (pb-10) ──────────────────────── */}
          <section className="flex flex-col pb-10">
            <div className="border-[4px] border-dashed border-[#CCCCCC] rounded-[4px] bg-[#EBEBEB] p-[24px_16px] text-center">
              <p style={{ fontFamily: "'Edu NSW ACT Cursive', cursive" }} className="text-[24px] text-[#8F8F8F] m-0 mb-2 font-normal">
                Full experience coming soon!
              </p>
              <p className="font-['Geologica',sans-serif] text-[10px] font-medium text-[#8F8F8F] tracking-[0.08em] uppercase m-0 font-[CRSV_0,SHRP_0]">
                I am working on building my portfolio and system powering it, full experience launching soon.
              </p>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
}
