'use client'

import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone, faBlog } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import profileImage from '@/asset/profile_main.jpeg'

export function Profile() {
  return (
    <section className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-gray-200">
      <div className="w-36 h-44 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
        <Image
          src={profileImage}
          alt="프로필 사진"
          width={144}
          height={176}
          className="object-cover w-full h-full"
          priority
        />
      </div>
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          최시영 <span className="text-gray-400 text-xl font-normal">(Sapcy)</span>
        </h1>
        <p className="text-lg text-blue-600 font-medium mb-4">DevOps Engineer</p>
        
        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
          <a
            href="mailto:sychoi1644@gmail.com"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
            sychoi1644@gmail.com
          </a>
          <span className="flex items-center gap-2 text-gray-600">
            <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
            010-5189-1644
          </span>
          <a
            href="https://github.com/sapcy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
            GitHub
          </a>
          <a
            href="https://tech-is-my-life.tistory.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FontAwesomeIcon icon={faBlog} className="w-4 h-4" />
            Blog
          </a>
        </div>
      </div>
    </section>
  )
}
