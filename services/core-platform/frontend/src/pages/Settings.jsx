import { Toaster, toast } from "sonner";

export default function Settings() {
	return (
		<>
			<main className='m-8 p-8 bg-white rounded-lg'>
				<section className='flex justify-between items-center mb-7'>
					<h1 className='text-2xl font-bold'>
						Configuración del sistema
					</h1>
				</section>

				<h2 className='flex justify-between text-[15px] font-semibold border-b-2 mb-5'>
					Configuración de archivos
				</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
					<article className='bg-gray-50 relative p-5 rounded-md shadow-lg hover:shadow-md transition-shadow'>
						Hola
					</article>
				</div>
			</main>
			<Toaster position='top-right' />
		</>
	);
}
