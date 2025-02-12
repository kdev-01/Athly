import React from "react";
import Carousel from "../components/Carousel";
import HomeEventCards from "../components/Home/HomeEventCards";
import logo from "../assets/Logo.png";

const HomePage = () => {
	return (
		<div className='bg-gray-100 min-h-screen'>
			{/* Header */}
			<header className='fixed top-0 left-0 w-full bg-black text-white py-2 z-50 shadow-lg shadow-xs'>
				<div className='max-w-7xl mx-auto flex items-center px-4'>
					{/* Logo */}
					<div className='flex-shrink-0'>
						<img
							src={logo}
							alt='Logo de la Federación'
							className='h-24 w-auto'
						/>
					</div>
					{/* Texto */}
					<div className='ml-6'>
						<h1 className='text-4xl font-bold drop-shadow-lg'>
							Federación Deportiva Provincial Estudiantil de Napo
						</h1>
						<p className='text-lg mt-2 drop-shadow-lg'>
							Promoviendo el espíritu deportivo en los estudiantes
						</p>
					</div>
				</div>
			</header>

			{/* Espaciado para contenido después del header */}
			<div className='pt-32'>
				{/* Carrusel */}
				<section className='py-50'>
					<Carousel />
				</section>

				{/* Sección ¿Quiénes Somos?, Misión, Visión */}
				<section className='py-10 bg-white'>
					<div className='max-w-7xl mx-auto px-4'>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							<div className='bg-gray-50 shadow rounded-lg p-6'>
								<h2 className='text-2xl font-bold mb-4 text-center'>
									¿QUIÉNES SOMOS?
								</h2>
								<p className='text-justify text-gray-700'>
									Federación Deportiva Provincial Estudiantil
									de Napo, al servicio de la niñez y juventud
									estudiantil de la provincia del Napo.
									Conformada por profesionales de la
									educación, representantes de cada una de las
									instituciones educativas filiales, como
									rectores o directores, coordinadores
									pedagógicos, profesores de aula o profesores
									de educación física. En asamblea general se
									elige el directorio para un período de
									cuatro años, quienes se encargan de
									coordinar y administrar cada uno de los
									torneos estudiantiles en los géneros
									masculino y femenino, en las diferentes
									categorías, pre infantil, infantil, inferior
									intermedia y superior...
								</p>
							</div>
							<div className='bg-gray-50 shadow rounded-lg p-6'>
								<h2 className='text-2xl font-bold mb-4 text-center'>
									MISIÓN
								</h2>
								<p className='text-justify text-gray-700'>
									Impulsar y fomentar la práctica del deporte,
									educación física y recreación, integrando a
									la niñez y juventud estudiosa de Napo, con
									una planificación direccionada a elevar los
									resultados deportivos estudiantiles, a
									través de planificar, organizar, desarrollar
									y masificar la actividad deportiva y al
									descubrimiento de jóvenes talentos para
									alcanzar niveles de desempeño que les
									permita integrar al deporte formativo.
								</p>
							</div>
							<div className='bg-gray-50 shadow rounded-lg p-6'>
								<h2 className='text-2xl font-bold mb-4 text-center'>
									VISIÓN
								</h2>
								<p className='text-justify text-gray-700'>
									Ser un organismo referente a nivel
									provincial en el desarrollo del deporte
									estudiantil y la práctica deportiva,
									comprometido con el progreso integral de los
									deportistas estudiantes de la provincia de
									Napo, con miras a participar y destacar en
									los torneos nacionales al final de cada fin
									de año calendario.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Torneos */}
				<section className='py-10 bg-white'>
					<div className='max-w-7xl mx-auto px-4'>
						<h2 className='text-2xl font-bold text-center mb-6'>
							Torneos Activos
						</h2>
						<HomeEventCards />
					</div>
				</section>
			</div>

			{/* Footer 
      <footer className="bg-black text-white py-10">
  <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-center md:text-left">
    {/* Columna 1: Contacto 
    <div className=" flex flex-col items-center md:items-start">
      <h2 className="text-xl font-bold mb-4">Contacto</h2>
      <ul className="space-y-2">
        <li>
          <span className="block">Dirección:</span>
          <span>Federación Deportiva Provincial de Napo</span>
        </li>
        <li>
          <span className="block">Teléfono:</span>
          <a href="tel:+593999999999" className="hover:underline">
            +593 999 999 999
          </a>
        </li>
        <li>
          <span className="block">Correo Electrónico:</span>
          <a href="mailto:info@fedenapo.org" className="hover:underline">
            info@fedenapo.org
          </a>
        </li>
      </ul>
    </div>

    {/* Columna 2: Acceso 
    <div className="flex flex-col items-center md:items-start">
      <h2 className="text-xl font-bold mb-4">Acceso</h2>
      <ul className="space-y-4">
        <li>
          <a
            href="/login"
            className="bg-white text-black py-2 px-4 rounded hover:bg-gray-200"
          >
            Inicio de Sesión
          </a>
        </li>
      </ul>
      <h2 className="text-xl font-bold mt-6 mb-4">Síguenos</h2>
      <div className="flex space-x-4">
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-75"
        >
          <img src="/path-to-facebook-icon.png" alt="Facebook" className="h-6 w-6" />
        </a>
      </div>
    </div>
  </div>

  {/* Línea de créditos *
  <div className="mt-10 text-center text-sm">
    <p>© 2025 Federación Deportiva de Napo. Todos los derechos reservados.</p>
    <p className="mt-2">Desarrollado por: Kevin Tapia y Jhonyl Sucuy</p>
  </div>
</footer>
*/}

			<footer class='bg-whit bg-black'>
				<div class='mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8'>
					<div class='md:flex md:justify-between'>
						<div class='mb-6 md:mb-0'>
							{/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
							<a class='flex items-center'>
								<img
									src={logo}
									class='h-8 me-3'
									alt='FlowBite Logo'
								/>
								<span class='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>
									FDPEN
								</span>
							</a>
						</div>
						<div class='grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3'>
							<div>
								<h2 class='mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white'>
									CONTACTO
								</h2>
								<ul class='text-gray-500 dark:text-gray-400 font-medium'>
									<li class='mb-4'>
										<a
											href='https://github.com/themesberg/flowbite'
											class='hover:underline '
										>
											Dirección:
										</a>
									</li>
									<li>
										<a
											href='https://discord.gg/4eeurUVvTy'
											class='hover:underline'
										>
											Telefono:
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h2 class='mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white'>
									ACCESO
								</h2>
								<ul class='text-gray-500 dark:text-gray-400 font-medium'>
									<li class='mb-4'>
										<a
											href='/login'
											class='hover:underline'
										>
											Inicio de Sesión
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<hr class='my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8' />
					<div class='sm:flex sm:items-center sm:justify-between'>
						<span class='text-sm text-gray-500 sm:text-center dark:text-gray-400'>
							© 2025 Federación Deportiva de Napo. Todos los
							derechos reservados.
						</span>
						<div class='flex mt-4 sm:justify-center sm:mt-0'>
							<a
								href='#'
								class='text-gray-500 hover:text-gray-900 dark:hover:text-white'
							>
								<svg
									class='w-4 h-4'
									aria-hidden='true'
									xmlns='http://www.w3.org/2000/svg'
									fill='currentColor'
									viewBox='0 0 8 19'
								>
									<path
										fill-rule='evenodd'
										d='M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z'
										clip-rule='evenodd'
									/>
								</svg>
								<span class='sr-only'>Facebook page</span>
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default HomePage;
