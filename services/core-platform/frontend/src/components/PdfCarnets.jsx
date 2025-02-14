import { calculateAge } from "../utils/operationsDates";
import { getImage, getColorTitle } from "../utils/getStyles";
import Button from "./Button";
import ProfileImage from "../assets/ProfileImage.png";
import BloodTypeIcon from "../components/Icons/BloodTypeIcon";
import TimeIcon from "../components/Icons/TimeIcon";
import BoyIcon from "../components/Icons/BoyIcon";
import WomanIcon from "../components/Icons/WomanIcon";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PdfCarnets({ event }) {
	const handleDownloadPdf = () => {
		const carnets = document.getElementById("carnets");
		html2canvas(carnets, {
			logging: true,
			letterRendering: 1,
			useCORS: false,
		}).then((canvas) => {
			const imgWidth = 210;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;
			const imgData = canvas.toDataURL("img/png");
			const pdf = new jsPDF("p", "mm", "a4");
			pdf.addImage(imgData, 0, 0, imgWidth, imgHeight);
			pdf.save("Carnets estudiantes.pdf");
		});
	};

	return (
		<div id='carnets' className='p-4'>
			<Button onClick={handleDownloadPdf}>Descargar carnets</Button>
			<section className='pt-6'>
				{event && event.length > 0 ? (
					event.map((ev) => (
						<div key={ev.event_id}>
							<h1 className='text-2xl font-semibold'>
								{ev.name}
							</h1>
							{ev.institutions && ev.institutions.length > 0 ? (
								ev.institutions.map((institution) => (
									<article
										key={institution.id}
										className='p-2 mt-6 mb-9'
									>
										<h2 className='text-[18px] font-semibold border-b-2 mb-7'>
											{institution.name}
										</h2>

										<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
											{institution.students.map(
												(student) => (
													<div
														key={student.id}
														className='bg-gray-50 relative p-5 rounded-md shadow-lg hover:shadow-md transition-shadow'
													>
														<section className='flex'>
															<img
																src={
																	ProfileImage
																}
																alt={`Foto de ${student.name}`}
																className='w-20 h-20 object-contain rounded-xl'
															/>

															<article className='flex flex-col ml-3'>
																<p className='font-bold'>
																	{
																		student.name
																	}{" "}
																	{
																		student.surname
																	}
																</p>

																<span className='text-xs mb-3'>
																	{
																		student.identification
																	}
																</span>

																<div className='flex gap-1'>
																	<p className='flex items-center p-[2px] pr-[8px] text-xs bg-neutral-100 rounded-lg mr-1'>
																		<TimeIcon className='p-1' />
																		{calculateAge(
																			student.date_birth,
																		)}{" "}
																		años
																	</p>

																	<p className='flex items-center p-[2px] pr-[8px] text-xs bg-neutral-100 rounded-lg mr-1'>
																		<BloodTypeIcon className='p-1' />
																		{
																			student.blood_type
																		}
																	</p>

																	<p className='flex items-center p-[2px] pr-[8px] text-xs bg-neutral-100 rounded-lg mr-1'>
																		{student.gender ===
																		1 ? (
																			<>
																				<BoyIcon />{" "}
																				Masculino
																			</>
																		) : (
																			<>
																				<WomanIcon className='p-[2px]' />{" "}
																				Femenino
																			</>
																		)}
																	</p>
																</div>
															</article>
														</section>

														<section
															className='bg-neutral-100 mt-4 p-3 rounded-xl text-sm'
															style={{
																backgroundImage:
																	getImage(
																		ev.sport
																			.name,
																	),
																backgroundSize:
																	"200px",
																backgroundPositionX:
																	"100%",
																backgroundPositionY:
																	"10%",
																backgroundRepeat:
																	"no-repeat",
															}}
														>
															<div className='flex flex-col gap-1'>
																<p>
																	<h3
																		className={`font-medium ${getColorTitle(
																			ev
																				.sport
																				.name,
																		)}`}
																	>
																		Institución
																		educativa:
																	</h3>
																	{
																		ev.institution_name
																	}
																</p>

																<p>
																	<h3
																		className={`font-medium ${getColorTitle(
																			ev
																				.sport
																				.name,
																		)}`}
																	>
																		Evento:
																	</h3>
																	{ev.name}
																</p>

																<p>
																	<h3
																		className={`font-medium ${getColorTitle(
																			ev
																				.sport
																				.name,
																		)}`}
																	>
																		Categoría:
																	</h3>
																	{
																		ev
																			.category
																			.name
																	}
																</p>
															</div>
														</section>
													</div>
												),
											)}
										</div>
									</article>
								))
							) : (
								<p className='flex flex-col items-center text-gray-500 mt-8'>
									No hay instituciones registradas.
								</p>
							)}
						</div>
					))
				) : (
					<p className='flex flex-col items-center text-gray-500 mt-8'>
						No hay eventos registrados.
					</p>
				)}
			</section>
		</div>
	);
}
