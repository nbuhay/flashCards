{
	"tmpCards": [
		{
			"question": ["How many AWS regions and availability zones are there (2016 CloudGuru)"],
			"answer": ["14 regions", "38 availability zones"]
		},
		{
			"question": ["How many AWS regions and availability zones are there (2017 AWS.com)"],
			"answer": ["16 regions", "42 availability zones"]
		},
		{
			"question": ["What is an edge location"],
			"answer": ["CDN end point for CloudFront"]
		},
		{
			"question": ["How does an edge location work"],
			"answer": ["First load files on CloudFront", "AWS user req files, goes to edge location", "edge location grabs from CDN, gives to user, caches at edge", "next user accessing same content can take advantage of cached content"]
		},
		{
			"question": ["What is IAM", "What does it do"],
			"answer": ["Identity Access Management", "Create/assign users, groups, roles, and policies"]
		},
		{
			"question": ["What is a VPC", "What is it like"],
			"answer": ["Virtual Private Cloud", "Comparable to a virtual data center", "Has cidr blocks, Internet gateways, subnets, etc."]
		},
		{
			"question": ["What is Route53"],
			"answer": ["AWS's domain name web service"]
		},
		{
			"question": ["Where was the Route53 service name derived"],
			"answer": ["Route66 was the first USA route", "Port 53 is the DNS port exposure to the Internet", "This is a potential AWS interview question..."]
		},
		{
			"question": ["What is CloudFront"],
			"answer": ["Content delivery network", "Cache files across AWS network"]
		},
		{
			"question": ["What is Direct Connect"],
			"answer": ["Connect your physical data center or office to AWS", "Dedicated line to Amazon"]
		},
		{
			"question": ["What is Elastic Beanstalk"],
			"answer": ["Service to deploy code onto AWS... In between EC2 and Lightsail", "AWS Elastic Beanstalk is an easy-to-use service for deploying and scaling web applications and services developed with Java, .NET, PHP, Node.js, Python, Ruby, Go, and Docker on familiar servers such as Apache, Nginx, Passenger, and IIS."
, "You can simply upload your code and Elastic Beanstalk automatically handles the deployment, from capacity provisioning, load balancing, auto-scaling to application health monitoring. At the same time, you retain full control over the AWS resources powering your application and can access the underlying resources at any time."]
		},
		{
			"question": ["What is Lambda"],
			"answer": ["Run code without provisioning or managing servers.", "Pay only for the compute time you consume, no charge when your code is not running"]
		},
		{
			"question": ["What is Lightsail"],
			"answer": ["New service, automates all of web site deployment for monthly cost.  Super basic."]
		},
		{
			"question": ["What is S3"],
			"answer": ["Simple Storage Service", "Object based Storage"]
		},
		{
			"question": ["What is Glacier"],
			"answer": ["Archive data at super low cost but high retrieval time (4-5 hours)"]
		},
		{
			"question": ["What is EFS"],
			"answer": ["Elastic File System - think Hadoop's hdfs potential"]
		},
		{
			"question": ["What is Storage Gateway"],
			"answer": ["Hybrid storage between on-prem and AWS"]
		},
		{
			"question": ["What is RDS"],
			"answer": ["Relational Database Service"]
		},
		{
			"question": ["What is DynamoDB"],
			"answer": ["NoSQL as a service"]
		},
		{
			"question": ["What is Elasticache"],
			"answer": ["Cache in-memory data stores"]
		},
		{
			"question": ["What is Snowball"],
			"answer": ["Migration service, move TBs of data to cloud at a setup fee and daily rate"]
		},
		{
			"question": ["What is DMS"],
			"answer": ["Database Migration Service"]
		},
		{
			"question": ["What is SMS (migration)"],
			"answer": ["Server Migration Service for on-prem vms to cloud"]
		},
		{
			"question": ["What is the root AWS account"],
			"answer": ["The AWS email used to sign up for AWS"]
		},
		{
			"question": ["What are some steps afte setting up an account"],
			"answer": ["Change link for users to sign on.", "Multifactor auth.", "Create users.", "Associate to groups."]
		},
		{
			"question": ["What default permissions do new AWS users have after created"],
			"answer": ["None, they must be added to groups or have policies attached manually"]
		},
		{
			"question": ["What is an IAM group and why is it useful"],
			"answer": ["Groups are definable sets of policies.", "Users assigned to a group get all policies assigned to that group.", "It is much easier to add a user to a group than to add many policies individually to each user."]
		},
		{
			"question": ["What is an IAM policy"],
			"answer": ["Define actions, services, and more that a user has access to within AWS"]
		}
	]
}