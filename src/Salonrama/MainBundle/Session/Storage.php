<?php

namespace Salonrama\MainBundle\Session;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Session\Storage\NativeSessionStorage;
use Salonrama\MainBundle\Encrypter;

class Storage extends NativeSessionStorage
{
    public function __construct(array $options = array(), ContainerInterface $container)
    {
        $request = $container->get('request');

        if($request->request->has('session_id'))
        {
            $request->cookies->set(session_name(), 1);
            session_id(Encrypter::decode($request->request->get('session_id')));
        }

        return parent::__construct($options);
    }
}

?>