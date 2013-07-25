<?php

namespace Salonrama\MainBundle\Security;

use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;

class ServiceUserProvider implements UserProviderInterface
{
    private $em;

    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    public function loadUserByUsername($username)
    {
        if($user = $this->em->getRepository('SalonramaMainBundle:User')->findOneBy(array('email' => $username)))
        {
            return $user;
        }
 
        throw new UsernameNotFoundException(sprintf('No record found for user %s', $username));
    }

    public function refreshUser(UserInterface $user)
    {
    	return $this->loadUserByUsername($user->getEmail());
    }

    public function supportsClass($class)
    {
    	return $class === 'Salonrama\MainBundle\Entity\User';
    }
}

?>