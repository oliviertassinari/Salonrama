<?php 

namespace Salonrama\MainBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\ArrayInput;
use Salonrama\MainBundle\File;

class DeploymentCommand extends ContainerAwareCommand
{
	protected function configure()
	{
		$this
		    ->setName('deployment:run')
		    ->setDescription("Déploiement")
			->addOption(
			        'location',
			        'l',
			        InputOption::VALUE_OPTIONAL,
			        'Support de travail',
			        'local'
			    );
	}

	protected function execute(InputInterface $input, OutputInterface $output)
	{
		$location = $input->getOption('location');
		$env = $input->getOption('env');

		$output->writeln('Parametres : location = '.$location. ' & env = '.$env.'.');

		$doctrineSchemaUpdate = $this->getApplication()->find('doctrine:schema:update');
		$doctrineSchemaUpdateArguments = array(
		    'command' => 'doctrine:schema:update',
		    '--force' => true
		);
		$doctrineSchemaUpdate->run(new ArrayInput($doctrineSchemaUpdateArguments), $output);

		$assetsInstall = $this->getApplication()->find('assets:install');
		$assetsInstallArguments = array(
		    'command' => 'assets:install web'
		);
		if($location == 'local')
		{
			$assetsInstallArguments['--symlink'] = true;
		}
		$assetsInstall->run(new ArrayInput($assetsInstallArguments), $output);

		File::removeFolder('app/cache/prod/');
		$output->writeln('Remove app/cache/prod/.');

		File::removeFolder('app/cache/dev/');
		$output->writeln('Remove app/cache/dev/.');

		File::removeFolder('web/css/');
		$output->writeln('Remove web/css/.');

		File::removeFolder('web/js/');
		$output->writeln('Remove web/js/.');

		$asseticDump = $this->getApplication()->find('assetic:dump');
		$asseticDumpArguments = array(
			'write_to' => 'web'
		);
		$asseticDump->run(new ArrayInput($asseticDumpArguments), $output);

	    $output->writeln('Deployment done.');
	}
}

?>