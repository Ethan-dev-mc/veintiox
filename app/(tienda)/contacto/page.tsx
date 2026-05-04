import type { Metadata } from 'next'
import ContactForm from '@/components/organisms/ContactForm'
import { Heading, Label, Text } from '@/components/atoms/Typography'
import { IconInstagram } from '@/components/atoms/Icon'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contáctanos — estamos para ayudarte.',
}

export default function ContactoPage() {
  return (
    <div className="container-site py-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
        <div>
          <Label>Escríbenos</Label>
          <Heading size="md" className="mt-1 mb-3">CONTACTO</Heading>
          <Text color="muted" className="mb-8 leading-relaxed">
            ¿Tienes dudas sobre un pedido, tallas o algo más? Responderemos en menos de 24 horas.
          </Text>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs text-vx-gray500 uppercase tracking-wider mb-1">Email</p>
              <a href="mailto:hola@veintiox.com" className="text-vx-cyan hover:underline text-sm">
                hola@veintiox.com
              </a>
            </div>
            <div>
              <p className="text-xs text-vx-gray500 uppercase tracking-wider mb-2">Redes sociales</p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/ventiox.mx/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-vx-gray400 hover:text-vx-cyan transition-colors">
                  <IconInstagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-vx-gray900 rounded-2xl p-6 md:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
