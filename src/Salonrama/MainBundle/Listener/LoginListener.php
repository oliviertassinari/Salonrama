<?php
 
namespace Salonrama\MainBundle\Listener;
 
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;
use Symfony\Component\Security\Core\SecurityContext;
use Doctrine\Bundle\DoctrineBundle\Registry as Doctrine;

class LoginListener
{
	private $securityContext;
	private $em;

	public function __construct(SecurityContext $securityContext, Doctrine $doctrine)
	{
		$this->securityContext = $securityContext;
		$this->em = $doctrine->getEntityManager();
	}

	public function onSecurityInteractiveLogin(InteractiveLoginEvent $event)
	{
		$user = $event->getAuthenticationToken()->getUser();
		$user->getAccount()->setLastLogin(new \DateTime());

		$this->em->flush();
	}
}

?>